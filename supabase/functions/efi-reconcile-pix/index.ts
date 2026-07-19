// Reconciles paid Pix directly from Efí, bypassing ZZGate's (unreliable)
// postback. Because ZZGate routes charges through THIS Efí account as the
// underlying PSP, every real payment shows up in Efí's "Pix recebidos" list.
// We poll it, match each received Pix to a pending order (by amount + payer CPF
// within a time window) and confirm it — same side-effects as zzgate-webhook
// (mark paid + Meta/TikTok CAPI + member access). Idempotent.
import { corsHeaders, jsonResponse, getMtlsClient, getPixAccessToken, PIX_HOST } from "../_shared/efi.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";

type EfiPix = {
  endToEndId?: string;
  txid?: string;
  valor?: string;
  horario?: string;
  pagador?: { cpf?: string; cnpj?: string; nome?: string };
  infoPagador?: string;
};

function onlyDigits(s: string | undefined | null): string {
  return (s ?? "").replace(/\D/g, "");
}

// Confirm one order: mark paid + fire the same side-effects zzgate-webhook does.
async function confirmOrder(supabase: ReturnType<typeof serviceClient>, orderId: string, efiTxid: string | undefined, paidAtIso: string, pix: EfiPix): Promise<string> {
  const { data: updated, error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: paidAtIso,
      raw: { efi_reconcile: pix, reconciled_at: new Date().toISOString() },
    })
    .eq("id", orderId)
    .neq("status", "paid")
    .select("id, product, customer_name, customer_email, customer_phone, customer_cpf, amount_cents, session_id, event_id_purchase")
    .maybeSingle();
  if (error || !updated) return "update_noop";

  const purchaseEid = updated.event_id_purchase || crypto.randomUUID();
  const contentName = updated.product === "lp2" ? "Comunidade X1 no Pix" : "InfoZap";
  const capiBody = {
    event_id: purchaseEid,
    session_id: updated.session_id || undefined,
    full_name: updated.customer_name,
    email: updated.customer_email,
    phone: updated.customer_phone,
    cpf: updated.customer_cpf,
    value: (updated.amount_cents || 0) / 100,
    currency: "BRL",
    content_name: contentName,
    order_id: updated.id,
  };
  try { await supabase.functions.invoke("meta-capi", { body: { ...capiBody, event_name: "Purchase" } }); } catch (e) { console.error("capi purchase (efi-reconcile) failed", e); }
  try { await supabase.functions.invoke("tiktok-events", { body: { ...capiBody, event_name: "CompletePayment" } }); } catch (e) { console.error("tiktok (efi-reconcile) failed", e); }
  try { await supabase.functions.invoke("grant-member-access", { body: { order_id: updated.id } }); } catch (e) { console.error("grant access (efi-reconcile) failed", e); }
  return "paid";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST" && req.method !== "GET") return jsonResponse({ error: "method" }, 405);

  let body: { minutes?: number; dry_run?: boolean } = {};
  try { body = await req.json(); } catch { /* GET or empty */ }
  const minutes = Math.min(Math.max(body.minutes ?? 180, 1), 1440);
  const dryRun = body.dry_run === true;

  const now = new Date();
  const start = new Date(now.getTime() - minutes * 60_000);
  const inicio = start.toISOString().replace(/\.\d{3}Z$/, "Z");
  const fim = now.toISOString().replace(/\.\d{3}Z$/, "Z");

  // 1) fetch received Pix from Efí (mTLS + OAuth). Paginate defensively.
  let token: string;
  try { token = await getPixAccessToken(); } catch (e) { return jsonResponse({ error: "efi_oauth", detail: String(e) }, 502); }
  const all: EfiPix[] = [];
  let paginaAtual = 0;
  for (let i = 0; i < 20; i++) {
    const url = `${PIX_HOST}/v2/pix?inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}&paginacao.paginaAtual=${paginaAtual}&paginacao.itensPorPagina=100`;
    const r = await fetch(url, {
      method: "GET",
      // @ts-ignore deno mTLS client
      client: await getMtlsClient(),
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return jsonResponse({ error: "efi_pix_list", status: r.status, detail: data }, 502);
    const pixArr: EfiPix[] = data?.pix ?? [];
    all.push(...pixArr);
    const total = data?.parametros?.paginacao?.quantidadeTotalDeItens ?? all.length;
    const perPage = data?.parametros?.paginacao?.itensPorPagina ?? 100;
    if ((paginaAtual + 1) * perPage >= total || pixArr.length === 0) break;
    paginaAtual++;
  }

  const supabase = serviceClient();
  const results: Array<Record<string, unknown>> = [];

  for (const pix of all) {
    const valorReais = Number(pix.valor);
    if (!Number.isFinite(valorReais) || !pix.txid) continue;
    const cents = Math.round(valorReais * 100);
    const paidAtIso = pix.horario ? new Date(pix.horario).toISOString() : new Date().toISOString();

    // EXACT match: ZZGate's transactionId (stored as orders.gateway_txid) is the
    // same id Efí returns as the received-Pix `txid`. Match on it — no fuzzy
    // amount/CPF guessing, and payments from other funnels sharing this Efí
    // account simply don't match our orders.
    const { data: match } = await supabase
      .from("orders")
      .select("id, status, customer_email, amount_cents")
      .eq("gateway_txid", pix.txid)
      .maybeSingle();

    if (!match) { results.push({ txid: pix.txid, valor: valorReais, matched: false }); continue; }
    if (match.status === "paid") { results.push({ txid: pix.txid, order_id: match.id, action: "already_paid" }); continue; }
    // Safety: the received amount must equal the order amount.
    if (cents !== match.amount_cents) { results.push({ txid: pix.txid, order_id: match.id, action: "amount_mismatch", got: valorReais, expected: (match.amount_cents ?? 0) / 100 }); continue; }
    if (dryRun) { results.push({ txid: pix.txid, valor: valorReais, matched: true, order_id: match.id, email: match.customer_email, action: "would_confirm" }); continue; }

    const outcome = await confirmOrder(supabase, match.id, pix.txid, paidAtIso, pix);
    results.push({ txid: pix.txid, valor: valorReais, order_id: match.id, email: match.customer_email, action: outcome });
  }

  return jsonResponse({
    ok: true,
    window: { inicio, fim, minutes },
    dry_run: dryRun,
    efi_pix_count: all.length,
    reconciled: results.filter((r) => r.action === "paid").length,
    results,
  });
});
