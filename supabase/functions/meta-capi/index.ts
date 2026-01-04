import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SHA-256 hash for PII data
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface MetaEvent {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url?: string;
  action_source: string;
  user_data: {
    em?: string[];
    ph?: string[];
    fn?: string[];
    ln?: string[];
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
  };
}

// Save session data for SCK lookup
async function saveSessionData(
  supabase: any,
  sck: string,
  fbp: string | null,
  fbc: string | null,
  ipAddress: string,
  userAgent: string,
  pageLocation: string | null
): Promise<void> {
  try {
    const { error } = await supabase
      .from('visitor_sessions')
      .upsert({
        sck,
        fbp,
        fbc,
        ip_address: ipAddress,
        user_agent: userAgent,
        page_location: pageLocation,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'sck' });
    
    if (error) {
      console.error('[SCK] Error saving session:', error);
    } else {
      console.log('[SCK] Session saved for:', sck);
    }
  } catch (error) {
    console.error('[SCK] Exception saving session:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID');
    const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
      console.error('Missing META_PIXEL_ID or META_ACCESS_TOKEN');
      return new Response(JSON.stringify({ error: 'Missing configuration' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client for session storage
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const body = await req.json();
    console.log('Received event:', JSON.stringify(body, null, 2));

    const {
      event_name,
      event_id,
      event_source_url,
      sck,
      email,
      phone,
      first_name,
      last_name,
      fbp,
      fbc,
      value,
      currency,
      content_name,
      content_category,
      content_ids,
      content_type,
    } = body;

    // Get client info from headers
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     '';
    const userAgent = req.headers.get('user-agent') || '';

    // Save session data for InitiateCheckout events (for webhook lookup)
    if (event_name === 'InitiateCheckout' && sck) {
      await saveSessionData(supabase, sck, fbp, fbc, clientIp, userAgent, event_source_url);
    }

    // Build user_data with hashed PII
    const userData: MetaEvent['user_data'] = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };

    if (email) {
      userData.em = [await sha256(email)];
    }
    if (phone) {
      // Remove non-digits and hash
      const cleanPhone = phone.replace(/\D/g, '');
      userData.ph = [await sha256(cleanPhone)];
    }
    if (first_name) {
      userData.fn = [await sha256(first_name)];
    }
    if (last_name) {
      userData.ln = [await sha256(last_name)];
    }
    if (fbp) {
      userData.fbp = fbp;
    }
    if (fbc) {
      userData.fbc = fbc;
    }

    // Build custom_data
    const customData: MetaEvent['custom_data'] = {};
    if (value !== undefined) {
      customData.value = value;
      customData.currency = currency || 'BRL';
    }
    if (content_name) {
      customData.content_name = content_name;
    }
    if (content_category) {
      customData.content_category = content_category;
    }
    if (content_ids) {
      customData.content_ids = content_ids;
      customData.content_type = content_type || 'product';
    }

    // Build the event
    const eventData: MetaEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: event_id || crypto.randomUUID(),
      action_source: 'website',
      user_data: userData,
    };

    if (event_source_url) {
      eventData.event_source_url = event_source_url;
    }

    if (Object.keys(customData).length > 0) {
      eventData.custom_data = customData;
    }

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
      return new Response(JSON.stringify({ error: 'Meta API error', details: metaResult }), {
        status: metaResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, ...metaResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in meta-capi:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
