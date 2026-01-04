import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WEBHOOK_SECRET = Deno.env.get('CAKTOPAY_WEBHOOK_SECRET');
    const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID');
    const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN');

    if (!WEBHOOK_SECRET) {
      console.error('CAKTOPAY_WEBHOOK_SECRET not configured');
      return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate webhook secret
    const receivedSecret = req.headers.get('x-webhook-secret');
    if (receivedSecret !== WEBHOOK_SECRET) {
      console.error('Invalid webhook secret');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = await req.json();
    console.log('CaktoPay webhook received:', JSON.stringify(payload, null, 2));

    // CaktoPay event types we care about
    const { event, data } = payload;

    // Map CaktoPay events to Meta events
    let metaEventName: string | null = null;
    
    if (event === 'purchase_approved' || event === 'sale_approved') {
      metaEventName = 'Purchase';
    } else if (event === 'checkout_started' || event === 'checkout_initiated') {
      metaEventName = 'InitiateCheckout';
    }

    if (!metaEventName) {
      console.log(`Event ${event} not mapped to Meta event, skipping`);
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract customer data from CaktoPay payload
    const customer = data?.customer || data?.buyer || {};
    const transaction = data?.transaction || data?.sale || data || {};

    const email = customer.email || data?.email;
    const phone = customer.phone || customer.cellphone || data?.phone;
    const name = customer.name || data?.name || '';
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // CaktoPay may provide fbp/fbc from their tracking
    const fbp = data?.fbp || customer.fbp || transaction.fbp;
    const fbc = data?.fbc || customer.fbc || transaction.fbc;
    
    // Transaction value
    const value = transaction.amount || transaction.value || data?.amount || data?.value || 0;
    const currency = transaction.currency || 'BRL';
    
    // Product info
    const productName = transaction.product_name || data?.product_name || data?.offer_name || '';
    const productId = transaction.product_id || data?.product_id || data?.offer_id || '';

    // Generate unique event_id from transaction
    const eventId = `caktopay_${event}_${transaction.id || data?.id || crypto.randomUUID()}`;

    if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
      console.error('Missing META_PIXEL_ID or META_ACCESS_TOKEN');
      return new Response(JSON.stringify({ error: 'Meta not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Hash PII for Meta
    async function sha256(message: string): Promise<string> {
      const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const userData: Record<string, any> = {};
    
    if (email) {
      userData.em = [await sha256(email)];
    }
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      userData.ph = [await sha256(cleanPhone)];
    }
    if (firstName) {
      userData.fn = [await sha256(firstName)];
    }
    if (lastName) {
      userData.ln = [await sha256(lastName)];
    }
    if (fbp) {
      userData.fbp = fbp;
    }
    if (fbc) {
      userData.fbc = fbc;
    }

    const eventData = {
      event_name: metaEventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        value: parseFloat(String(value)) / 100, // CaktoPay sends in cents
        currency: currency,
        content_name: productName,
        content_ids: productId ? [productId] : [],
        content_type: 'product',
      },
    };

    console.log('Sending to Meta:', JSON.stringify(eventData, null, 2));

    // Send to Meta Conversions API
    const metaUrl = `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events`;
    const metaResponse = await fetch(metaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [eventData],
        access_token: META_ACCESS_TOKEN,
      }),
    });

    const metaResult = await metaResponse.json();
    console.log('Meta API response:', JSON.stringify(metaResult, null, 2));

    if (!metaResponse.ok) {
      console.error('Meta API error:', metaResult);
      // Still return 200 to CaktoPay to avoid retries
      return new Response(JSON.stringify({ success: false, meta_error: metaResult }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, ...metaResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in caktopay-webhook:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    // Return 200 to avoid webhook retries
    return new Response(JSON.stringify({ error: message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
