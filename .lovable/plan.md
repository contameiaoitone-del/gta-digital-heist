## Contexto

Hoje o `Purchase` server-side **já é disparado** nos 2 caminhos de aprovação:

- **Pix aprovado** → `efi-webhook` chama `meta-capi` com `event_name: "Purchase"` (linha 53-60).
- **Cartão aprovado** → `efi-create-card` chama `meta-capi` imediatamente após `isApproved` (linha 110-131).

O problema: **não temos prova** de que a chamada chegou no Meta com sucesso. Os logs da edge function são voláteis e o painel retornou vazio. Sem isso, não dá para diferenciar “Meta recusou o evento” de “evento foi enviado mas o gerenciador atrasou”.

Além disso, agora que o usuário é auto-logado direto para `/membros` (sem passar por `/obrigado`), o `Purchase` client-side (Pixel no browser) pode não disparar a tempo. A solução correta é **garantir o server-side e auditá-lo**.

## O que vai mudar

### 1. Nova tabela `meta_capi_log` (migration)

Armazena cada chamada à `meta-capi` com resultado.

Colunas:
- `id uuid pk`
- `created_at timestamptz default now()`
- `event_name text` (PageView, InitiateCheckout, Purchase…)
- `event_id text`
- `order_id uuid null`
- `session_id text null`
- `value numeric null`
- `status_code int null` (HTTP do graph.facebook)
- `success boolean`
- `meta_response jsonb null` (resposta do Meta — `events_received`, `fbtrace_id`)
- `error text null`

RLS: só `service_role` lê/escreve. Index em `event_name`, `order_id`, `created_at desc`.

### 2. `meta-capi` edge function — gravar log

Após o `fetch` para `graph.facebook.com`:
- Inserir 1 linha em `meta_capi_log` com `event_name`, `event_id`, `order_id`, `status_code`, `success`, `meta_response` (ou `error`).
- Não bloquear a resposta se o log falhar (try/catch, console.error).

### 3. `efi-webhook` (Pix) — robustecer

- Antes de chamar `meta-capi`, checar se `event_id_purchase` já existe em `meta_capi_log` com `success=true` para esse `order_id` (idempotência — Efí pode reentregar webhook).
- Manter o disparo atual.

### 4. `efi-create-card` (Cartão) — sem mudança funcional

Já dispara corretamente. O log na nova tabela já vai cobrir.

### 5. Salvar `meta_capi_purchase_sent_at` na `orders` (opcional, simples)

Adicionar coluna `meta_purchase_sent_at timestamptz null` em `orders`. Atualizada pelo `meta-capi` quando `event_name = "Purchase"` e `success = true`. Permite ver no painel admin sem precisar consultar a tabela de log.

### 6. Painel Admin — nova aba "CAPI Log" (só leitura)

Adicionar em `src/pages/admin/Admin.tsx` uma seção que lista as últimas 50 linhas de `meta_capi_log`, com filtro por `event_name = Purchase` e ícone verde/vermelho por `success`. Útil para diagnóstico futuro sem precisar abrir SQL.

## Detalhes técnicos

```text
Fluxo Pix aprovado:
  Efí webhook  →  efi-webhook  →  meta-capi (Purchase)  →  graph.facebook
                                       │
                                       └─→ INSERT meta_capi_log
                                       └─→ UPDATE orders.meta_purchase_sent_at

Fluxo Cartão aprovado:
  POST /efi-create-card  →  insert order paid  →  meta-capi (Purchase)  →  graph.facebook
                                                       │
                                                       └─→ INSERT meta_capi_log
                                                       └─→ UPDATE orders.meta_purchase_sent_at
```

Idempotência: `meta-capi` faz `select 1 from meta_capi_log where event_id = ? and success = true` antes de enviar. Se já existe, pula e retorna `{deduped: true}`.

## Arquivos tocados

- **Migration**: criar `meta_capi_log` + adicionar coluna `meta_purchase_sent_at` em `orders`.
- **Edit**: `supabase/functions/meta-capi/index.ts` — gravar log + dedup + atualizar `orders`.
- **Edit (mínimo)**: `supabase/functions/efi-webhook/index.ts` — só comentário de idempotência (a checagem real fica no meta-capi).
- **Edit**: `src/pages/admin/Admin.tsx` — nova seção CAPI Log.

## Como validar depois de pronto

1. Fazer 1 compra Pix de teste e verificar `meta_capi_log` com `event_name=Purchase`, `success=true`, `status_code=200`.
2. Confirmar `events_received: 1` no `meta_response`.
3. Conferir no Gerenciador de Eventos do Meta a chegada do evento (com `event_id` igual).
