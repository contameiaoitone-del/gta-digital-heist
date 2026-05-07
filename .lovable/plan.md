## Objetivo

Mostrar no painel `/admin/capi-log` qual campanha/conjunto/criativo originou cada venda (UTMs) e o **SCK** (ID de sessão do visitante), além do que já é exibido hoje.

## Como vai funcionar

```text
URL com utms ──► visitor_sessions (sck, utm_*, fbclid, ttclid)
                          │
                          ▼
            checkout (session_id = sck)
                          │
                          ▼
   webhook CaktoPay/Efi ──► orders (session_id, utm_*)
                          │
                          ▼
                meta-capi ──► meta_capi_log (sck + utm_* desnormalizados)
                          │
                          ▼
               /admin/capi-log mostra colunas novas
```

## Mudanças

### 1. Banco de dados (migration)
- `visitor_sessions`: adicionar `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` (text, nullable).
- `orders`: adicionar as mesmas 5 colunas `utm_*` (nullable). Já existe `session_id` para ligar com SCK.
- `meta_capi_log`: adicionar `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` (desnormalizados para listagem rápida no painel sem joins).

### 2. Captura no front (`src/hooks/useTracking.ts` + `src/lib/utmAutoFill.ts`)
- Ler UTMs da URL na entrada (já são gravadas em cookies). Enviar também ao `track-session` no payload, junto com `fbclid`/`ttclid`.

### 3. `supabase/functions/track-session/index.ts`
- Persistir `utm_source/medium/campaign/content/term` na `visitor_sessions` via mesmo padrão `setIf`.

### 4. Checkout / criação de pedido
- Garantir que ao criar a `order` (Efi/CaktoPay) o `session_id` (SCK) e os UTMs sejam gravados. Para CaktoPay já chega via querystring no checkout; o webhook (`efi-webhook` e similar Cakto) deve pegar UTMs do `visitor_sessions` pelo SCK e gravar nas colunas `utm_*` da `orders`.

### 5. `supabase/functions/meta-capi/index.ts`
- Quando carregar `visitor_sessions` pelo `sck`, copiar UTMs para o registro do `meta_capi_log` (novas colunas).
- Também enviar como `custom_data` para Meta (campos `utm_source` etc) — útil em conversões personalizadas.

### 6. UI `src/pages/admin/CapiLog.tsx`
- Adicionar colunas: **SCK** (8 chars + tooltip), **utm_source**, **utm_campaign**, **utm_content** (com tooltip mostrando todos os 5 ao passar o mouse).
- Adicionar busca por SCK / utm_campaign no topo.
- Manter colunas atuais (Quando, Evento, Status, HTTP, Valor, event_id, order_id, Erro).

## Resultado
No painel você verá: data, evento, status, valor, event_id, order_id, **SCK**, **utm_source / campaign / content** — permitindo identificar exatamente qual campanha/conjunto/anúncio gerou cada `Purchase`.
