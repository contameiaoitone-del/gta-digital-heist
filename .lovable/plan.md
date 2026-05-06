## Trocar TikTok Pixel ID e Access Token

Hoje o TikTok está configurado em dois lugares:

1. **Pixel ID (público)** — hardcoded em `src/lib/tiktokPixel.ts`:
   ```ts
   export const TIKTOK_PIXEL_ID = "D7TMC2JC77U4TTGIIJ70";
   ```
   Esse valor é usado no client (carrega o snippet do Pixel) e como fallback.

2. **Pixel ID + Access Token (server-side / CAPI)** — secrets usados pela edge function `supabase/functions/tiktok-events/index.ts`:
   - `TIKTOK_PIXEL_ID`
   - `TIKTOK_ACCESS_TOKEN`
   - `TIKTOK_TEST_EVENT_CODE` (opcional, só pra teste)

### O que vou fazer

1. Atualizar `src/lib/tiktokPixel.ts` com o **novo Pixel ID** que você me passar.
2. Atualizar os secrets `TIKTOK_PIXEL_ID` e `TIKTOK_ACCESS_TOKEN` no backend (via ferramenta de secrets — você vai colar os valores numa caixa segura, não precisa mandar no chat).
3. Re-deploy da edge function `tiktok-events` pra garantir que pegue os novos secrets.
4. Validar disparando um evento de teste em `/infozap` (PageView) e conferindo no TikTok Events Manager.

### O que preciso de você

- **Novo Pixel ID** (pode mandar aqui no chat — é público, ex: `D7TMC2JC77U4TTGIIJ70`).
- **Novo Access Token** — NÃO mande no chat. Quando eu pedir, vai abrir uma caixa segura pra você colar.

Onde achar no TikTok Ads Manager: Assets → Events → Web Events → seu Pixel → Settings → "Generate Access Token".

Me confirma aprovando o plano e já me manda o **Pixel ID novo** na próxima mensagem.
