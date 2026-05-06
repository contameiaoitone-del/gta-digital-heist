
## Plano: Checkout próprio na InfoZap com Efí Bank

Substituir o redirect para o Cakto por um modal de checkout dentro da própria `/infozap`, integrado direto com a API da Efí Bank em **produção**, com **Pix** ou **Cartão de Crédito (até 12x sem juros repassados)**, valor fixo de **R$ 67,00**. Após pagamento confirmado → redireciona para `/obrigado`.

---

### 1. Fluxo do usuário

Ao clicar em qualquer CTA da `/infozap`:

1. Abre **modal único** (Dialog) com resumo (R$ 67,00) e formulário base: Nome, E-mail, Telefone, CPF (com máscara + validação de DV).
2. Dois botões: **Pagar com Pix** / **Pagar com Cartão**.
3. **Pix** → tela com QR Code + botão "Copiar código" + contador de expiração (1h) + polling a cada 4s. Quando pago → redireciona `/obrigado?metodo=pix`.
4. **Cartão** → formulário (número, nome impresso, validade, CVV, parcelas 1x–12x com valor por parcela exibido). Tokenização **no browser** via SDK JS da Efí (PCI — número do cartão nunca passa pelo nosso backend). Ao aprovar → `/obrigado?metodo=cartao`.
5. Erros inline no modal sem fechar.

---

### 2. Página `/obrigado`

Nova rota `src/pages/Obrigado.tsx` registrada em `App.tsx`:
- Mensagem "Pagamento confirmado / Em processamento" conforme `?metodo=`.
- Próximos passos / acesso ao InfoZap.
- Visual alinhado ao tema neon (#080808 + neon pink/green).
- Dispara evento de conversão (Meta Pixel/CAPI).

---

### 3. Backend — Edge Functions (produção)

| Function | Função |
|---|---|
| `efi-create-pix` | OAuth Efí (mTLS), cria cobrança `/v2/cob`, gera QR `/v2/loc/:id/qrcode`, grava `orders`, devolve `{ qrcode_image, copia_cola, txid, order_id }`. |
| `efi-check-status` | Recebe `order_id`, devolve `{ status }` da tabela `orders`. |
| `efi-create-card` | Recebe dados + `payment_token` (gerado no front) + `installments` (1–12), chama `/v1/charge/one-step`, grava `orders`, devolve `{ status, charge_id }`. |
| `efi-webhook` | Endpoint público (`verify_jwt = false`) que a Efí chama ao confirmar Pix. Validação por **mTLS** (a Efí só chama webhooks com seu próprio certificado — sem necessidade de HMAC). |

Detalhes:
- **Produção only**: `https://pix.api.efipay.com.br` e `https://cobrancas.api.efipay.com.br`. Sem sandbox.
- **mTLS** via `Deno.createHttpClient({ cert, key })` em todas as chamadas Pix.
- **Validação Zod** em todo input (CPF com DV, email, telefone, parcelas 1–12, valor **travado em 6700 centavos no servidor** — front não pode alterar).
- **Rate limit** in-memory por IP (10 req/min) nas functions de criação.

Após o deploy te passo a **URL pública do `efi-webhook`** para você cadastrar no painel da Efí (associar à sua chave Pix).

---

### 4. Banco de dados

Tabela `orders` **já existe** (criada na migração anterior). Sem alterações.

---

### 5. Secrets (vou pedir via add_secret após sua aprovação)

Apenas os 5 que você tem:
- `EFI_CLIENT_ID`
- `EFI_CLIENT_SECRET`
- `EFI_CERT_PEM` (com `-----BEGIN CERTIFICATE-----` ... `-----END CERTIFICATE-----`)
- `EFI_KEY_PEM` (com `-----BEGIN PRIVATE KEY-----` ... `-----END PRIVATE KEY-----`)
- `EFI_PIX_KEY` (sua chave Pix recebedora)

**Sem `EFI_WEBHOOK_HMAC`** — a validação do webhook será só por mTLS.

---

### 6. Frontend

**Novos arquivos:**
- `src/components/checkout/CheckoutModal.tsx` — Dialog principal (etapas: `form` → `pix` | `card` → redirect).
- `src/components/checkout/PixStep.tsx` — QR Code, copia-cola, polling.
- `src/components/checkout/CardStep.tsx` — formulário cartão + select de parcelas (1x–12x com valor calculado) + tokenização via SDK Efí carregado dinamicamente.
- `src/hooks/useEfiCheckout.ts` — wrapper de `supabase.functions.invoke`.
- `src/lib/validators.ts` — Zod (CPF com DV, telefone, email).
- `src/pages/Obrigado.tsx`.

**Alterados:**
- `src/pages/InfoZap.tsx` — remover `getCheckoutUrl` / `CHECKOUT_BASE`; trocar os `<a href={checkoutUrl}>` por `<button onClick={() => setOpen(true)}>` que abre o `CheckoutModal`. Visual e textos preservados.
- `src/App.tsx` — registrar rota `/obrigado`.

Dependências: `qrcode.react`, `react-imask` (zod já presente).

---

### 7. Segurança

- Valor R$ 67,00 fixo no servidor.
- CPF com validação de dígito verificador.
- Cartão tokenizado no browser via SDK Efí — número nunca chega no nosso backend.
- Webhook protegido por mTLS.
- `orders` sem policies públicas; só service role.
- Rate limit por IP.
- Logs sem PII (sem CPF/cartão completos).

---

### 8. Ordem de execução após aprovação

1. Pedir os 5 secrets via `add_secret`.
2. Implementar as 4 edge functions (com `verify_jwt = false` no `efi-webhook`).
3. Implementar `CheckoutModal` + sub-componentes + hook + validators + `/obrigado`.
4. Trocar CTAs em `src/pages/InfoZap.tsx`.
5. Te entregar a **URL do webhook** para você cadastrar no painel da Efí.
6. Subir direto a R$ 67,00 (sem teste de R$ 0,01, salvo se você pedir).
