## Objetivo

Permitir alternar o gateway do **Pix** entre **Efí** (atual) e **ZZGate** sem alterar o checkout de **cartão** (que continua 100% via Efí) e sem afetar o tracking avançado (Meta CAPI, TikTok, SCK, event_id, session_id).

A escolha do gateway será feita em uma nova página `/admin/credenciais`, acessível por um botão no painel admin.

---

## Como vai funcionar

### Fluxo do usuário (não muda visualmente)
1. Usuário escolhe Pix no checkout → frontend chama uma função única (`pix-create`) em vez de `efi-create-pix` direto.
2. `pix-create` lê o gateway ativo no banco e roteia para Efí ou ZZGate.
3. Resposta é normalizada (`copia_cola`, `qrcode_image`, `order_id`, `event_id_purchase`, `amount_cents`) — o componente do QR Code não muda.
4. Polling (`pix-check-status`) e webhook funcionam para os dois gateways.
5. Quando o pagamento confirma, o mesmo fluxo de Purchase (Meta CAPI + TikTok CompletePayment + grant-member-access) dispara — **tracking idêntico**.

### Configuração no admin
- Botão **"Credenciais de pagamento"** no header de `/admin`.
- Página `/admin/credenciais` permite:
  - Selecionar gateway ativo do Pix (radio: Efí / ZZGate).
  - Editar credenciais ZZGate (Client ID, Client Secret, Pix Key opcional).
  - Editar credenciais Efí (Client ID, Client Secret, Pix Key) — hoje só ficam em secrets, passam a ficar editáveis via UI.
  - Botão "Testar conexão" para cada gateway (chama `/v2/oauth/token` da ZZGate ou OAuth da Efí e mostra OK/erro).
- Cartão continua sempre via Efí — uma nota visível na página deixa isso claro.

---

## Arquitetura técnica

### Banco de dados
Nova tabela `payment_settings` (singleton, 1 linha):

```text
- id (uuid pk)
- active_pix_gateway: text  -- 'efi' | 'zzgate' (default 'efi')
- efi_client_id, efi_client_secret, efi_pix_key, efi_cert_pem, efi_key_pem (text, nullable)
- zzgate_client_id, zzgate_client_secret (text, nullable)
- updated_at, updated_by
```

RLS: SELECT/UPDATE só para `has_role(auth.uid(),'admin')`. Edge functions usam **service role**, então leem normalmente.

Nova coluna em `orders`:
- `pix_gateway: text` ('efi' | 'zzgate', nullable, default null) — para o webhook e o polling saberem onde buscar o status.
- `gateway_txid: text` — generaliza `efi_txid` (mantemos `efi_txid` para compat e gravamos nos dois).

### Edge functions

**Novas:**
- `pix-create` — recebe payload do checkout, lê `payment_settings`, roteia.
- `pix-check-status` — substitui `efi-check-status` para Pix; para Efí mantém comportamento atual, para ZZGate consulta status (ou só lê `orders.status` se o webhook chegou).
- `zzgate-webhook` — endpoint público que recebe `RECEIVEPIX` da ZZGate, valida `external_id` (= order_id), atualiza `orders` e dispara o mesmo fluxo de Purchase (Meta CAPI + TikTok + grant-member-access). **Idêntico ao `efi-webhook` em side effects.**
- `payment-settings-get` / `payment-settings-update` — CRUD admin, valida `has_role(...,'admin')` via JWT, retorna credenciais mascaradas no GET.
- `payment-gateway-test` — testa OAuth do gateway selecionado.

**Mantidas sem alteração:**
- `efi-create-card`, `efi-webhook` (Pix Efí), `efi-register-webhook` — cartão e Pix Efí continuam funcionando.
- `meta-capi`, `tiktok-events`, `track-session`, `grant-member-access` — **tracking não é tocado**.

### Shared helper
- Novo `_shared/pix-gateway.ts` com função `loadActiveGateway()` e `createZzgatePix(payload)`:
  - Faz `POST /v2/oauth/token` (Basic auth com base64 de `client_id:client_secret`).
  - Faz `POST /v2/pix/qrcode` com `external_id = order.id`, `postbackUrl` = URL do `zzgate-webhook`, retorna `{ qrcode (copia/cola), transactionId }`.
  - Como ZZGate não retorna imagem base64 do QR, o frontend já gera a imagem a partir do `copia_cola` (lib `qrcode`) — mantemos a interface.

### Frontend
- `useEfiCheckout.ts` → renomear internamente, mas manter API. `createPix` passa a chamar `pix-create`. Cartão continua em `efi-create-card`. Polling chama `pix-check-status`.
- `CheckoutModal` (componente do QR): se `qrcode_image` vier vazio (caso ZZGate), gera QR no client a partir de `copia_cola` usando `qrcode` (já presente ou bun add).
- Nova rota `/admin/credenciais` → `src/pages/admin/PaymentCredentials.tsx`.
- Botão "Credenciais" no header de `/admin/Admin.tsx` (ao lado de "Usuários").

### Tracking — garantia de zero impacto
- `pix-create` **gera/usa o mesmo `event_id_purchase`** e persiste `session_id` igual hoje.
- `zzgate-webhook` chama `meta-capi`, `tiktok-events` e `grant-member-access` com **exatamente o mesmo payload** que `efi-webhook`.
- SCK / fbp / fbc continuam vindo do `track-session` no frontend — independente do gateway.

---

## Segurança
- Credenciais persistidas em tabela com RLS admin-only (não em secrets, para serem editáveis pela UI). Service role lê. Tabela não exposta ao frontend (frontend só chama edge function).
- `zzgate-webhook` valida `external_id` (= `order.id`) e exige que o `amount` bata com `orders.amount_cents`.
- `payment-settings-update` valida JWT do admin.

---

## Entregáveis (ordem de execução)
1. Migration: tabela `payment_settings` + colunas `pix_gateway`/`gateway_txid` em `orders` + RLS.
2. `_shared/pix-gateway.ts` + funções `pix-create`, `pix-check-status`, `zzgate-webhook`, `payment-settings-{get,update}`, `payment-gateway-test`.
3. Frontend: `useEfiCheckout` aponta para `pix-create`/`pix-check-status`; `CheckoutModal` gera QR se necessário.
4. Página `/admin/credenciais` + botão no header admin + rota em `App.tsx`.
5. Configurar webhook URL da ZZGate (mostrada na página admin para o usuário copiar e colar no painel ZZGate).

Cartão e tracking permanecem inalterados.