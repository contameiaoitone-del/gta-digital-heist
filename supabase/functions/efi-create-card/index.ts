import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://esm.sh/zod@3.23.8";
import {
  corsHeaders,
  jsonResponse,
  rateLimit,
  getIp,
  isValidCpf,
  getCobAccessToken,
  COB_HOST,
  PRODUCT_AMOUNT_CENTS,
  PRODUCT_NAME,
} from "../_shared/efi.ts";

const BodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  cpf: z.string().trim().min(11).max(20),
  payment_token: z.string().trim().min(10).max(200),
  installments: z.number().int().min(1).max(12),
  session_id: z.string().trim().min(1).max(80).optional(),
  event_id_purchase: z.string().trim().min(1).max(80).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const ip = getIp(req);
    if (!rateLimit(ip)) return jsonResponse({ error: "rate_limited" }, 429);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return jsonResponse({ error: "invalid", issues: parsed.error.flatten() }, 400);
    const { name, email, phone, cpf, payment_token, installments } = parsed.data;
    const cleanCpf = cpf.replace(/\D/g, "");
    const cleanPhone = phone.replace(/\D/g, "");
    if (!isValidCpf(cleanCpf)) return jsonResponse({ error: "invalid_cpf" }, 400);

    const token = await getCobAccessToken();

    // Step 1: create charge
    const chargeRes = await fetch(`${COB_HOST}/v1/charge/one-step`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          { name: PRODUCT_NAME, value: PRODUCT_AMOUNT_CENTS, amount: 1 },
        ],
        payment: {
          credit_card: {
            installments,
            payment_token,
            customer: {
              name,
              email,
              cpf: cleanCpf,
              phone_number: cleanPhone,
            },
          },
        },
      }),
    });
    const charge = await chargeRes.json();
    if (!chargeRes.ok) {
      console.error("charge create failed", charge);
      return jsonResponse({ error: "efi_charge", detail: charge }, 502);
    }

    const chargeId = String(charge.data?.charge_id ?? charge.charge_id ?? "");
    const cardStatus = String(charge.data?.status ?? charge.status ?? "");
    // Efí returns "approved" when authorized. Some flows return "new" → may approve async.
    const isApproved = cardStatus === "approved" || cardStatus === "paid";
    const finalStatus = isApproved ? "paid" : cardStatus === "canceled" ? "failed" : "pending";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: order, error: dbErr } = await supabase
      .from("orders")
      .insert({
        product: "infozap",
        amount_cents: PRODUCT_AMOUNT_CENTS,
        customer_name: name,
        customer_email: email,
        customer_phone: cleanPhone,
        customer_cpf: cleanCpf,
        payment_method: "card",
        installments,
        efi_charge_id: chargeId,
        status: finalStatus,
        paid_at: isApproved ? new Date().toISOString() : null,
        raw: charge,
      })
      .select("id")
      .single();
    if (dbErr) {
      console.error("db insert failed", dbErr);
      return jsonResponse({ error: "db" }, 500);
    }

    return jsonResponse({
      order_id: order.id,
      charge_id: chargeId,
      status: finalStatus,
    });
  } catch (e) {
    console.error("efi-create-card error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
