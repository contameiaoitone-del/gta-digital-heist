## O que vai ser feito

Remover o script do **Google Tag Manager** do arquivo `index.html`, que hoje carrega globalmente em todas as rotas do site.

## Impacto no tracking da Meta — ZERO

Confirmei lendo o código que o trackeamento da Meta **não depende do GTM**:

- **Meta Pixel (client-side)** é carregado diretamente via `src/lib/metaPixel.ts` (função `ensurePixel`), injetado pelo `TrackingProvider.tsx` nas rotas `/lp1`, `/lp2` e `/mentoria` (e sub-rotas como `/lp97`, `/lp97-vsl`, `/lp2-5`).
- **Meta CAPI (server-side)** é disparado pela Edge Function `meta-capi` chamada pelo hook `useTracking.ts` — totalmente independente do GTM.
- **Eventos** (`PageView`, `InitiateCheckout`, `Purchase`) são enviados via `window.fbq(...)` diretamente, sem passar por `dataLayer.push` do GTM.
- Cookies `_fbp` / `_fbc` são criados pelo próprio script do Pixel da Meta (`fbevents.js`), não pelo GTM.

Ou seja: remover o GTM **não afeta** Pixel, CAPI, deduplicação de eventos, nem o sistema SCK de matching com webhook do CaktoPay.

## O que será removido

No arquivo `index.html`, o bloco:

```text
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','euln474r=...');</script>
<!-- End Google Tag Manager -->
```

## O que NÃO será removido (continua intacto)

- Otimização do VTurb (preloads e dns-prefetch) no `<head>`
- Fontes Google (Bebas Neue, Teko, Barlow)
- Meta tags de SEO/OG/Twitter
- Atributos `data-*` para GTM nos botões CaktoPay (ficam inertes, sem efeito colateral — podem ser limpos depois se desejar)
- Toda a stack de tracking da Meta (Pixel + CAPI + SCK)
- Tracking do TikTok Pixel (também independente do GTM)

## Efeitos colaterais a considerar

1. Qualquer tag que estava sendo disparada **apenas via container GTM** (ex.: Google Ads, GA4, eventos auxiliares configurados na Stape) **deixará de disparar**. Se você usa Google Ads/Analytics pelo GTM, precisará reativar de outra forma depois.
2. Os atributos `data-event=...` nos botões de checkout (usados pelo GTM React Tracking) ficarão presentes no HTML mas sem listener — sem impacto funcional.

## Arquivo alterado

- `index.html` — remover apenas o bloco GTM