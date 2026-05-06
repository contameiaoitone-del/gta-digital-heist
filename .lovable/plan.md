# Plano aprovado

## 1. Adicionar secret
- `META_TEST_EVENT_CODE` = `TEST58976` (via add_secret). O `meta-capi/index.ts` já lê esse env e injeta `test_event_code` no payload automaticamente.

## 2. `src/lib/utmAutoFill.ts`
- Preencher `utm_medium` e `utm_campaign` de forma independente quando ausentes (hoje só preenche se `utm_source` faltar). Garante que entradas como `?utm_source=lovable.dev` recebam medium/campaign derivados.

## 3. `src/hooks/useTracking.ts`
- Em `trackInitiateCheckout`, enviar `content_name: "InfoZap"` tanto no `fbq("track", "InitiateCheckout", ...)` quanto no payload da CAPI, para enriquecer `custom_data`.

## 4. Validação
- Recarregar `/infozap` em aba limpa → URL deve ter `utm_source`, `utm_medium`, `utm_campaign`, `sck`.
- Meta Events Manager → Test Events (TEST58976) → PageView, InitiateCheckout e Purchase aparecem como **Browser + Server** (deduplicados).
- Conferir `user_data`: em, ph, fn, ln, external_id, fbp, fbc, client_ip_address, client_user_agent, country/st/ct.

## 5. Pós-validação
- Quando confirmar que está tudo certo, **remover** o secret `META_TEST_EVENT_CODE` para os eventos voltarem a contar como tráfego real.
