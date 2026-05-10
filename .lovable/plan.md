## Objetivo

Permitir editar credenciais Efí Bank no painel admin (aba Credenciais), pré-preenchendo os valores atuais. Adicionar toggle de "olho" para mostrar/ocultar o Client Secret tanto em ZZGate quanto em Efí. Remover o campo de URL de Webhook do ZZGate (a documentação confirma que `postbackUrl` é enviado por request — não há configuração global no painel ZZGate).

## Mudanças no banco (migration)

Adicionar colunas na tabela `payment_settings` (todas `text`, nullable):
- `efi_client_id`
- `efi_client_secret`
- `efi_pix_key`
- `efi_payee_code` (CNPJ recebedor)
- `efi_cert_pem`
- `efi_key_pem`

RLS já existente (admin-only) cobre as novas colunas.

## Backend (`supabase/functions/_shared/efi.ts` + `payment-settings`)

1. `_shared/pix-gateway.ts`: adicionar helpers `loadEfiCreds()` que retorna valores do DB; quando `null/empty`, faz fallback para `Deno.env.get("EFI_*")`. Assim, na primeira leitura, o admin vê os secrets atuais (mascarados) sem precisar recadastrar.
2. `_shared/efi.ts`: trocar leituras diretas de `Deno.env.get("EFI_...")` por `loadEfiCreds()` (assíncrono). Atualizar `efi-create-pix`, `efi-create-card`, `efi-config`, `efi-register-webhook` se necessário para `await`.
3. `payment-settings/index.ts`:
   - `GET`: retornar também `efi_client_id`, `efi_pix_key`, `efi_payee_code`, `efi_client_secret_masked`, `efi_has_secret`, `efi_has_cert`, `efi_has_key`. Se DB vazio, ler do env e mascarar (sem persistir).
   - `update`: aceitar campos `efi_client_id`, `efi_client_secret`, `efi_pix_key`, `efi_payee_code`, `efi_cert_pem`, `efi_key_pem`. Mantém regra: string vazia = não altera; valor preenchido = atualiza.
   - Remover `webhook_url` da resposta (não é mais exibido).

## Frontend (`src/pages/admin/PaymentCredentials.tsx`)

1. **Nova seção "Credenciais Efí Bank"** com inputs:
   - Client ID
   - Client Secret (com botão olho 👁 para mostrar/ocultar)
   - Chave Pix
   - Código do Recebedor (Payee Code / CNPJ)
   - Certificado (.pem) — `<textarea>` monoespaçado
   - Chave Privada (.pem) — `<textarea>` monoespaçado
2. **Seção ZZGate**:
   - Adicionar botão olho 👁 no Client Secret.
   - **Remover** o input "URL de Webhook (postback)" — substituir por nota curta: "A URL de postback é enviada automaticamente em cada cobrança; não é necessário configurar no painel ZZGate."
3. Componente reutilizável local `SecretInput` com toggle de visibilidade (ícones `Eye` / `EyeOff` do `lucide-react`).
4. Pré-preenchimento: ao montar, popular todos os campos Efí com os valores retornados pelo GET (campos não-secret vêm em claro; secret/cert/key ficam vazios mas mostram "atual: ••• — deixe em branco para manter").
5. Botão "Testar conexão" também para Efí (usa endpoint `payment-settings?action=test` com `gateway: "efi"`).

## Detalhes técnicos

- A migration adiciona apenas colunas; nada é removido para manter compatibilidade com secrets existentes.
- Os secrets do projeto (`EFI_*`) continuam funcionando como fallback caso o admin nunca preencha o DB — zero downtime na migração.
- Validação Zod no `payment-settings/update` ganha campos opcionais para Efí (limitar `cert_pem`/`key_pem` a ~20KB cada).
- Endpoint `test` ganha branch `gateway: "efi"`: tenta `getEfiAccessToken()` com creds enviadas (mTLS) e retorna `{ ok: true/false }`.
- Documentação ZZGate confirmada: `postbackUrl` é enviado em cada `POST /v2/pix/qrcode` — não há cadastro global de webhook.
