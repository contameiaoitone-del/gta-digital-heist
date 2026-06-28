// Creates a one-step card charge for a paid module (kind=mentoria).
// Auth required. Validates module + user access, then calls Efí cobranças.
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
} from "../_shared/efi.ts";

const BodySchema = z.object({
  module_id: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  cpf: z.string().trim().min(11).max(20),
  payment_token: z.string().trim().min(10).max(200),
  installments: z.number().int().min(1).max(12),
});

function parseJwtSub(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.sub ?? null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const ip = getIp(req);
    if (!rateLimit(ip)) return jsonResponse({ error: "rate_limited" }, 429);

    const userId = parseJwtSub(req.headers.get("Authorization"));
    if (!userId) return jsonResponse({ error: "unauthorized" }, 401);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return jsonResponse({ error: "invalid", issues: parsed.error.flatten() }, 400);
    const { module_id, name, email, phone, cpf, payment_token, installments } = parsed.data;
    const cleanCpf = cpf.replace(/\D/g, "");
    const cleanPhone = phone.replace(/\D/g, "");
    if (!isValidCpf(cleanCpf)) return jsonResponse({ error: "invalid_cpf" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: mod } = await supabase
      .from("modules")
      .select("id, title, kind, price_cents")
      .eq("id", module_id)
      .maybeSingle();
    if (!mod || mod.kind !== "mentoria" || !mod.price_cents || mod.price_cents <= 0) {
      return jsonResponse({ error: "module_not_purchasable" }, 400);
    }
    const productKey = `mentoria:${mod.id}`;
    const { data: existing } = await supabase
      .from("member_access")
      .select("id")
      .eq("user_id", userId)
      .in("product", [productKey, "mentoria"])
      .eq("active", true)
      .maybeSingle();
    if (existing) return jsonResponse({ error: "already_purchased" }, 409);

    const productName = `Mentoria — ${mod.title}`.slice(0, 140);
    const token = await getCobAccessToken();

    const chargeRes = await fetch(`${COB_HOST}/v1/charge/one-step`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ name: productName, value: mod.price_cents, amount: 1 }],
        payment: {
          credit_card: {
            installments,
            payment_token,
            customer: { name, email, cpf: cleanCpf, phone_number: cleanPhone },
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
    const isApproved = cardStatus === "approved" || cardStatus === "paid";
    const finalStatus = isApproved ? "paid" : cardStatus === "canceled" ? "failed" : "pending";

    const { data: order, error: dbErr } = await supabase
      .from("orders")
      .insert({
        product: productKey,
        amount_cents: mod.price_cents,
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

    if (isApproved) {
      try {
        await supabase.functions.invoke("grant-member-access", { body: { order_id: order.id } });
      } catch (e) {
        console.error("grant-access failed", e);
      }
    }

    return jsonResponse({
      order_id: order.id,
      charge_id: chargeId,
      status: finalStatus,
      amount_cents: mod.price_cents,
    });
  } catch (e) {
    console.error("mentoria-create-card error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});