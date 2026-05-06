## Correções no checkout de cartão

### 1. Foco perdido a cada dígito
Em `src/components/checkout/CardStep.tsx`, o componente `Field` está declarado dentro de `CardStep`. A cada keystroke, o React desmonta/remonta os inputs.

**Fix:** mover `Field` e `inputCls` para escopo do módulo (fora do componente).

### 2. Erro 502 `property_does_not_exists: payment_token`
O loader atual tenta `payment-token.efipay.com.br` e cai no fallback `sandbox.gerencianet.com.br` quando falha → gera token de **sandbox** → enviado para API de **produção** → Efí rejeita.

**Fix:** trocar para o SDK oficial moderno `payment-token-efi` via CDN jsDelivr, com `setEnvironment("production")` e `setAccount(payeeCode)` explícitos.

```js
const result = await EfiPay.CreditCard
  .setAccount(payeeCode)
  .setEnvironment("production")
  .setCreditCardData({ number, cvv, expirationMonth, expirationYear, holderName, holderDocument, reuse: false })
  .getPaymentToken();
```

### 3. Endereço de cobrança
**Não será adicionado.** Confirmado na doc oficial do Efí que `billing_address` é opcional no `POST /v1/charge/one-step`. Mantém conversão alta.

## Arquivos alterados
- `src/components/checkout/CardStep.tsx` — extrair `Field`/`inputCls`, reescrever `loadEfiSdk` para usar SDK oficial, atualizar fluxo de tokenização.

## Sem mudanças
- `supabase/functions/efi-create-card/index.ts` — payload já está correto.
- `src/hooks/useEfiCheckout.ts`, `src/lib/validators.ts` — sem alteração.

## Verificação
1. Abrir checkout cartão → digitar sem perder foco.
2. Pagar com cartão real → resposta `paid`/`pending`, não mais 502.
3. Se houver erro, checar `edge_function_logs` de `efi-create-card`.
