
## Plano: Checkout próprio na InfoZap com Efí Bank (Pix + Cartão até 12x)

Substituir o redirecionamento atual para o Cakto por um modal de checkout dentro da própria página `/infozap`, integrado direto com a API da Efí Bank em **produção**, com pagamento via **Pix** ou **Cartão de Crédito (até 12x)**, valor fixo de **R$ 67,00**. Após pagamento confirmado, redireciona para `/obrigado`.

---

### 1. Fluxo do usuário

Ao clicar em qualquer CTA da página `/infozap`:

1. Abre um **modal único** (Dialog) com resumo da oferta (R$ 67,00) e formulário base:
   - Nome completo, E-mail, Telefone (máscara), CPF (máscara + dígito verificador)
2. Dois botões: **Pagar com Pix** / **Pagar com Cartão**.
3. **Pix** → tela com QR Code + botão "Copiar código" + contador de expiração (1h) + polling a cada 4s. Quando pago → redireciona para `/obrigado?metodo=pix`.
4. **Cartão** → formulário (número, nome impresso, validade, CVV, **parcelas 1x a 12x sem juros repassados — valor da parcela calculado e exibido**). Tokenização no browser via SDK JS da Efí (PCI). Ao aprovar → redireciona para `/obrigado?metodo=cartao`.
5. Erros mostrados inline no modal sem fechar.

---

### 2. Página `/obrigado`

Nova rota pública `src/pages/Obrigado.tsx` registrada em `App.tsx`:
- Mensagem de confirmação "Pagamento confirmado / Pagamento em processamento" conforme `?metodo=`.
- Próximos passos / instruções de acesso ao InfoZap.
- Visual alinhado ao tema neon da página InfoZap.
- Dispara evento de conversão (Meta Pixel via GTM, se aplicável).

---

### 3. Backend — Edge Functions (produção)

| Function | Função |
|---|---|
| `efi-create-pix` | OAuth Efí (mTLS), cria cobrança `/v2/cob`, gera QR Code `/v2/loc/:id/qrcode`, grava `orders`, devolve `{ qrcode_image, copia_cola, txid, order_id }`. |
| `efi-check-status` | Recebe `order_id`, devolve `{ status }` lendo da tabela `orders` (atualizada via webhook ou consulta direta). |
| `efi-create-card` | Recebe dados + `payment_token` (gerado no front) + `installments` (1–12), chama `/v1/charge/one-step`, grava `orders`, devolve `{ status, charge_id }`. |
| `efi-webhook` | Endpoint público (`verify_jwt = false`) que a Efí chama ao confirmar Pix; valida origem por mTLS/HMAC e marca `orders.status = 'paid'`. |

Detalhes técnicos:
- **Produção**: `https://pix.api.efipay.com.br` e `https://cobrancas.api.efipay.com.br`. Sem flag de sandbox.
- **mTLS**: certificado `.p12` da Efí convertido para PEM (cert + key) e usado via `Deno.createHttpClient({ cert, key })` em todas as chamadas Pix.
- **Validação Zod** em todos os inputs (CPF com dígito verificador, email, telefone, parcelas 1–12, valor fixado em 6700 centavos no servidor — nunca confiar no front).
- **Rate limit** in-memory por IP (10 req/min) nas functions de criação.

---

### 4. Banco de dados — nova tabela `orders`

```sql
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  product text not null,                 -- 'infozap'
  amount_cents int not null,             -- 6700
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_cpf text not null,
  payment_method text not null,          -- 'pix' | 'card'
  installments int,                      -- 1..12 (cartão)
  efi_txid text,
  efi_charge_id text,
  status text not null default 'pending',-- pending|paid|failed|expired
  paid_at timestamptz,
  raw jsonb
);
alter table public.orders enable row level security;
-- Sem policies públicas. Apenas service role (edge functions) acessa.
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.update_updated_at_column();
```

Sem auth de usuário final. Edge functions usam service role.

---

### 5. Secrets necessários (vou pedir via add_secret após sua aprovação)

- `EFI_CLIENT_ID` — Client ID de **produção** da Efí
- `EFI_CLIENT_SECRET` — Client Secret de **produção**
- `EFI_CERT_PEM` — certificado (cert) em PEM, base64
- `EFI_KEY_PEM` — chave privada (key) em PEM, base64
- `EFI_PIX_KEY` — sua chave Pix recebedora cadastrada na Efí
- `EFI_WEBHOOK_HMAC` — segredo para validar callback do webhook (opcional, recomendado)

> Se preferir colar o `.p12` direto, te explico como converter para PEM antes (1 comando openssl) — é necessário porque o Deno trabalha com PEM.

---

### 6. Frontend

**Novos arquivos:**
- `src/components/checkout/CheckoutModal.tsx` — Dialog principal com etapas (`form` → `pix` | `card`) e redirect final.
- `src/components/checkout/PixStep.tsx` — QR Code (`qrcode.react`), copia-e-cola, polling.
- `src/components/checkout/CardStep.tsx` — formulário cartão + select de parcelas (1x a 12x com valor calculado por parcela exibido) + tokenização via SDK Efí carregado dinamicamente.
- `src/hooks/useEfiCheckout.ts` — wrapper de `supabase.functions.invoke`.
- `src/lib/validators.ts` — Zod (CPF com DV, telefone, email).
- `src/pages/Obrigado.tsx` — página de confirmação.

**Arquivos alterados:**
- `src/pages/InfoZap.tsx` — remover `getCheckoutUrl` / `CHECKOUT_BASE`; substituir os `<a href={checkoutUrl}>` (linhas ~194, ~556 e dentro de `CTAButton`) por `<button onClick={() => setOpen(true)}>` que abre o `CheckoutModal`. Visual e textos preservados.
- `src/App.tsx` — registrar rota `/obrigado`.

Dependências a instalar: `qrcode.react`, `react-imask`. (`zod` provavelmente já presente.)

---

### 7. Segurança

- Valor de R$ 67,00 fixado no servidor — front não pode alterar.
- CPF validado por dígito verificador.
- Cartão tokenizado no browser pelo SDK da Efí — número do cartão **nunca** trafega pelo nosso backend.
- Webhook valida origem (HMAC + mTLS).
- Tabela `orders` sem policies públicas; somente service role lê/escreve.
- Rate limit por IP nas edge functions de criação.
- Logs sem dados sensíveis (sem CPF/cartão completos).

---

### 8. Ordem de execução após sua aprovação

1. Criar migração da tabela `orders`.
2. Pedir os secrets de produção da Efí via `add_secret`. **Implementação para após você fornecer.**
3. Implementar as 4 edge functions (com `verify_jwt = false` no `efi-webhook`).
4. Implementar `CheckoutModal` + sub-componentes + hook + validators + página `/obrigado`.
5. Trocar CTAs em `src/pages/InfoZap.tsx` para abrir o modal.
6. Testar um Pix real de R$ 0,01? — me avise se quiser que eu reduza temporariamente o valor para um teste de ponta a ponta antes de subir os R$ 67,00 finais; caso contrário sobe direto a R$ 67,00.
