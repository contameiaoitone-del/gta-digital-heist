## Objetivo

Ativar o Meta Pixel `1533634077714814` **apenas na página `/infozap`** (e seu fluxo de checkout/obrigado), mantendo a CAPI já implementada com deduplicação.

## Decisão de escopo

- O Pixel **não vai no `index.html` global** (senão dispara em todas as rotas — Index, Links, RPClose, RPZap, CloseFriends, RealZapAcademy etc.).
- O Pixel é injetado **dinamicamente só quando o usuário entra em `/infozap`**, e o tracking (`PageView`, `InitiateCheckout`, `Purchase` — Pixel + CAPI) só dispara nesse fluxo.

## Mudanças

### 1. `src/components/TrackingProvider.tsx` — restringir a rotas InfoZap
- Hoje: roda em todas as rotas exceto `/obrigado` e `/rp-close-sucesso`.
- Novo: roda **somente** em `/infozap` e `/obrigado` (a página de obrigado é o destino do checkout do InfoZap, onde o `Purchase` é creditado).
- Ao entrar numa rota InfoZap, antes de chamar `init()`, garante que o snippet do Pixel já está carregado via helper `ensurePixel()`.

### 2. Novo helper `src/lib/metaPixel.ts`
- Função `ensurePixel(pixelId: string)` idempotente:
  - Se `window.fbq` já existe → no-op.
  - Senão, injeta o snippet oficial da Meta no `<head>` (cria `<script>` apontando pra `https://connect.facebook.net/en_US/fbevents.js` async) e roda `fbq('init', pixelId)`.
  - Adiciona `<noscript><img src="https://www.facebook.com/tr?id=...&ev=PageView&noscript=1"/></noscript>` no `<body>` (uma única vez).
- Constante `META_PIXEL_ID = "1533634077714814"` exportada (Pixel ID é público — ok no client).

### 3. `src/hooks/useTracking.ts` — esperar `fbq` antes de disparar
- Adicionar `await waitForFbq(2000)` antes dos `fbq("track", ...)` em `init`, `trackInitiateCheckout` e `trackPurchase`. Faz polling curto (50ms) até `window.fbq` existir ou timeout. Se timeout, ainda assim a CAPI dispara (server-side independe).

### 4. `CheckoutModal.tsx` e `Obrigado.tsx`
- Sem mudança de lógica — já usam o hook. Mas vão precisar carregar o Pixel também:
  - `CheckoutModal` é renderizado a partir do `/infozap`, então o Pixel já estará carregado pelo `TrackingProvider`.
  - `Obrigado.tsx` é destino pós-checkout do InfoZap → no `useEffect` da página, chamar `ensurePixel(META_PIXEL_ID)` antes de `trackPurchase`.

### 5. Outras páginas (Index, RPZap, CloseFriends, RealZapAcademy, Links, RPClose)
- **Não alteradas.** Sem Pixel, sem CAPI. (Caso amanhã queira ativar pra outras, é só adicionar a rota em `TrackingProvider`.)

## Resultado esperado

```text
Usuário entra em /infozap
  └─> TrackingProvider injeta Pixel (1533634077714814)
  └─> useTracking.init() dispara:
        ├─ fbq('track','PageView', {eventID})    ← browser
        └─ meta-capi PageView (mesmo eventID)    ← servidor

Clica CTA → CheckoutModal
  └─ saveLead() → grava em visitor_sessions
  └─ trackInitiateCheckout()
        ├─ fbq('track','InitiateCheckout', {eventID})
        └─ meta-capi InitiateCheckout (mesmo eventID)

Cartão aprovado / Pix pago
  ├─ Cartão: efi-create-card → meta-capi Purchase + redireciona /obrigado
  │       └─ Obrigado.tsx → fbq('track','Purchase', {mesmo eventID})
  └─ Pix:    efi-webhook → meta-capi Purchase (server-side fecha sozinho)
```

## Validação pós-deploy

1. Abrir `/infozap` em aba anônima → DevTools Network → confirmar request `fbevents.js` + `tr/?id=1533634077714814&ev=PageView`.
2. Em outras páginas (`/`, `/rp-zap`, `/links`) → confirmar que **não** carrega `fbevents.js`.
3. Meta Events Manager → **Test Events** (ou Live) → ver `PageView`, `InitiateCheckout`, `Purchase` chegando com flag "Deduplicated" (Browser + Server).
4. Caso queira monitorar só os testes, adicionar secret opcional `META_TEST_EVENT_CODE`.

## Arquivos

- ➕ `src/lib/metaPixel.ts`
- ✏️ `src/components/TrackingProvider.tsx`
- ✏️ `src/hooks/useTracking.ts`
- ✏️ `src/pages/Obrigado.tsx`
