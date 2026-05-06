## Reverter disparo temporário de CompletePayment do TikTok

Remover o código temporário que disparava `CompletePayment` no TikTok toda vez que o modal de checkout abria. Voltar ao fluxo padrão: `CompletePayment` só dispara via webhook do Efí quando o pagamento é confirmado.

### Mudanças

**1. `src/components/checkout/CheckoutModal.tsx`**
- Remover `trackTikTokPurchaseTest` da desestruturação do `useTracking()`
- Remover a chamada `trackTikTokPurchaseTest({ value: 67 })` do `useEffect`
- Remover comentário `// TEMP: TikTok conversion unlock`
- Restaurar dependências do `useEffect` para `[open, trackInitiateCheckout]`

**2. `src/hooks/useTracking.ts`**
- Remover a função `trackTikTokPurchaseTest` (linhas 269-302)
- Remover `trackTikTokPurchaseTest` do `return` do hook

### Inalterado
- `efi-webhook` continua disparando `CompletePayment` real no Pix confirmado
- `InitiateCheckout` (Meta + TikTok) continua disparando ao abrir o modal
- Toda lógica de Meta CAPI e TikTok Events API permanece intacta
