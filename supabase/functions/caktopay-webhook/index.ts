import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

// SHA-256 hash for PII data
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Lookup session data by SCK
async function lookupSession(supabase: any, sck: string) {
  try {
    const { data, error } = await supabase
      .from('visitor_sessions')
      .select('fbp, fbc, ip_address, user_agent')
      .eq('sck', sck)
      .single();
    
    if (error) {
      console.error('[SCK] Error looking up session:', error);
      return null;
    }
    
    console.log('[SCK] Session found for:', sck, data);
    return data;
  } catch (error) {
    console.error('[SCK] Exception looking up session:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WEBHOOK_SECRET = Deno.env.get('CAKTOPAY_WEBHOOK_SECRET');
    const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID');
    const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

    // Initialize Supabase client for session lookup
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

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
    
    // Try to get SCK from various possible locations in the payload
    const sck = payload.sck || data?.sck || data?.custom_data?.sck || 
                data?.metadata?.sck || data?.tracking?.sck || '';

    // Lookup session data using SCK
    let sessionData = null;
    if (sck) {
      sessionData = await lookupSession(supabase, sck);
    }

    // Get fbp and fbc - prefer session data (original visitor cookies)
    const fbp = sessionData?.fbp || data?.fbp || customer.fbp || transaction.fbp || '';
    const fbc = sessionData?.fbc || data?.fbc || customer.fbc || transaction.fbc || '';
    
    // Get client IP - prefer session data
    const clientIp = sessionData?.ip_address || data?.client_ip || '';
    const userAgent = sessionData?.user_agent || data?.user_agent || '';

    console.log('[SCK] Using session data:', { 
      sck, 
      hasSession: !!sessionData,
      hasFbp: !!fbp, 
      hasFbc: !!fbc, 
      hasIp: !!clientIp 
    });
    
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
    if (clientIp) {
      userData.client_ip_address = clientIp;
    }
    if (userAgent) {
      userData.client_user_agent = userAgent;
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
