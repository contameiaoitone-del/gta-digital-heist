## Objetivo

Liberar o evento de conversão `CompletePayment` na conta de TikTok Ads, disparando-o temporariamente toda vez que o modal de checkout do InfoZap abrir (junto com o `InitiateCheckout` que já dispara). Apenas para o TikTok desbloquear o evento — Meta segue intacto.

## Mudanças

### 1. `src/hooks/useTracking.ts`
Adicionar uma nova função `trackTikTokPurchaseTest({ value })` que:
- Gera um `event_id` único
- Aguarda `ttq` + cookie `_ttp`
- Dispara no Pixel client-side: `ttq.track("CompletePayment", { value, currency: "BRL", contents: [...], content_type: "product" }, { event_id })`
- Chama a edge function `tiktok-events` com `event_name: "CompletePayment"` + mesmo `event_id` (deduplicação CAPI)
- **Não** toca em Meta, **não** grava `orders`, **não** mexe no fluxo de Pix/Cartão real

### 2. `src/components/checkout/CheckoutModal.tsx`
No mesmo `useEffect` que já dispara `trackInitiateCheckout` ao abrir o modal, chamar também `trackTikTokPurchaseTest({ value: 67 })`. Guardado pelo mesmo `initiateFiredRef` para não duplicar.

### 3. Marcador `// TEMP: TikTok conversion unlock`
Adicionar comentário claro nos dois lugares para facilitar a remoção depois quando você pedir para voltar ao padrão.

## O que NÃO muda
- Webhook do Efí (`efi-webhook`) continua disparando `CompletePayment` real no momento do pagamento confirmado
- Meta Pixel/CAPI permanecem inalterados
- Nenhuma alteração no banco, edge functions ou outros eventos

## Como reverter depois
Quando você disser "voltar ao padrão", basta remover a chamada em `CheckoutModal.tsx` e a função `trackTikTokPurchaseTest` do hook.
