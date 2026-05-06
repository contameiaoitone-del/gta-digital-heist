## Objetivo

Corrigir o timing do evento `InitiateCheckout` para disparar quando o modal de checkout abre (não apenas após preencher o formulário) e dar instruções claras pra verificar Test Events do domínio real.

## Mudança de código

### `src/components/checkout/CheckoutModal.tsx`

Substituir o `useEffect` que dispara `InitiateCheckout` em `step === "method"` por um que dispare quando o modal abre (`open === true`), uma única vez por sessão de modal:

```ts
useEffect(() => {
  if (open && !initiateFiredRef.current) {
    initiateFiredRef.current = true;
    trackInitiateCheckout({ value: 67 });
  }
}, [open, trackInitiateCheckout]);
```

O `reset()` em `close(false)` já zera o `initiateFiredRef`, então fechar e reabrir o modal vai disparar novamente — comportamento correto.

Resultado:
- Pixel Helper acusa `InitiateCheckout` (com `value: 67`, `currency: BRL`, `content_name: InfoZap`, `eventID`) **no instante em que o pop-up abre**.
- CAPI envia o mesmo evento pro servidor com o mesmo `event_id` (deduplicação).

## Verificação após o deploy

### A) Pixel Helper (instantâneo)
1. Abra `https://reallifeacademy.com.br/infozap` com o Pixel Helper ativo.
2. Veja `PageView` na carga.
3. Clique em qualquer CTA "Quero meu acesso" → o pop-up abre → Pixel Helper deve mostrar `InitiateCheckout` na hora.

### B) Test Events do domínio real (duas opções)
- **Opção 1 (sem código):** Gerenciador de Eventos → Pixel `1533634077714814` → aba **"Testar eventos"** → cole `https://reallifeacademy.com.br/infozap` no campo "Testar eventos do navegador" → "Abrir site". Os eventos do **Pixel browser** do domínio aparecerão ali (CAPI ainda não, porque sem `META_TEST_EVENT_CODE`).
- **Opção 2 (browser + CAPI):** copie o código `TESTxxxxx` da aba Test Events e me envie — eu re-adiciono como secret `META_TEST_EVENT_CODE` temporariamente para CAPI também aparecer. Depois dos testes, removo de novo.

### C) Eventos de produção (com delay)
Em **Visão geral / Eventos do site**, espere 5–20 min após interagir. Você verá:
- `PageView` e `InitiateCheckout` com colunas **Browser**, **Server**, **Deduplicado**.
- "Deduplicado" significa que Pixel + CAPI estão compartilhando o mesmo `event_id` (resultado desejado — Meta não conta em dobro).

### D) EMQ (Qualidade de Correspondência)
Vai subir nos próximos dias conforme volume aumenta. Com email, telefone, nome, CPF, IP, UA, fbp, fbc, geo todos enviados hashados, o esperado é EMQ 7+ no `Purchase` e 5+ no `InitiateCheckout`/`PageView`.

## Por que `fbp`/`fbc` ainda aparecem vazios em testes diretos
Comportamento normal: `_fbp` é setado pelo próprio script do Pixel após carregar (já tratamos com `waitForFbp`). `_fbc` só é setado quando há `fbclid` na URL — ou seja, só quando o tráfego vem de um clique em anúncio Meta. Tráfego direto, orgânico ou de outras fontes nunca terá `fbc`. Não é bug.
