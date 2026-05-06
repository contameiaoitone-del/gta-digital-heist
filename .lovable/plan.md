## Goal

Replicate the advanced Meta tracking architecture for **TikTok Ads**: client-side TikTok Pixel + server-side Events API (CAPI equivalent) with shared `event_id` for deduplication, hashed user_data, and full session enrichment from `visitor_sessions`.

Events fired on InfoZap funnel: `Pageview`, `InitiateCheckout`, `CompletePayment` (Purchase).

## Required secrets (you'll provide)

1. `TIKTOK_PIXEL_ID` — found in TikTok Ads Manager → Assets → Events → Web Events → your pixel
2. `TIKTOK_ACCESS_TOKEN` — generated in the same pixel page → "Events API" → "Generate Access Token"
3. (optional) `TIKTOK_TEST_EVENT_CODE` — for real-time Test Events panel validation

I'll request these via `add_secret` after you approve.

## Implementation

### 1. Database
Add columns to `visitor_sessions`:
- `ttclid` (TikTok click ID, equivalent to `fbclid`)
- `ttp` (TikTok browser cookie `_ttp`, equivalent to `_fbp`)
- `event_id_pageview_tt`, `event_id_initiate_tt`, `event_id_purchase_tt` (separate IDs since TikTok requires its own dedup)

### 2. Frontend — `src/lib/tiktokPixel.ts` (new)
Mirror `metaPixel.ts`: load TikTok Pixel snippet asynchronously with `ensureTtq()`, expose `waitForTtq()` and `waitForTtp()` helpers.

### 3. Frontend — `src/hooks/useTracking.ts`
Extend existing hook (don't duplicate) so each tracked event fires Meta + TikTok in parallel:
- `init()` → also `ttq.track("Pageview", {...}, { event_id })` and call new `tiktok-events` edge function
- `trackInitiateCheckout()` → also `ttq.track("InitiateCheckout", { value, currency, contents })` + server call
- `trackPurchase()` → also TikTok `CompletePayment` (called from `Obrigado` page and `efi-webhook`)
- Capture `ttclid` from URL and read `_ttp` cookie alongside `fbc`/`fbp`

### 4. `src/components/TrackingProvider.tsx`
Add `ensureTtq()` next to `ensurePixel()` so TikTok loads only on `/infozap` (same gating as Meta).

### 5. New edge function — `supabase/functions/tiktok-events/index.ts`
Server-side Events API to `https://business-api.tiktok.com/open_api/v1.3/event/track/`:
- Accepts same payload shape as `meta-capi`
- Hashes `email`, `phone` (E.164), `external_id` (CPF), `first_name`, `last_name` with SHA-256
- Sends `ttclid`, `ttp`, `ip`, `user_agent` un-hashed in `user.*`
- Pulls session context from `visitor_sessions` by `session_id` (same as Meta)
- Sends shared `event_id` for browser/server dedup
- Headers: `Access-Token: <TIKTOK_ACCESS_TOKEN>`
- Supports `test_event_code` when secret is set

### 6. Server-side Purchase — `supabase/functions/efi-webhook/index.ts`
After invoking `meta-capi` on payment confirmation, also invoke `tiktok-events` with `CompletePayment` and the stored `event_id_purchase_tt`.

### 7. `track-session` edge function
Accept and persist new fields: `ttclid`, `ttp`, `event_id_pageview_tt`, `event_id_initiate_tt`, `event_id_purchase_tt`.

## Validation

After deploy:
1. Visit `/infozap?ttclid=test123` → TikTok Pixel Helper extension should show Pageview firing client-side
2. Open checkout modal → InitiateCheckout fires
3. Complete a R$67 Pix test → CompletePayment appears in TikTok Events Manager → "Diagnostics" tab as **deduplicated** (Browser + Server)
4. Match Quality score should be 7+ thanks to hashed email/phone/CPF/name + ttclid + ttp + IP + UA

## Files touched

- new: `src/lib/tiktokPixel.ts`, `supabase/functions/tiktok-events/index.ts`
- edited: `src/hooks/useTracking.ts`, `src/components/TrackingProvider.tsx`, `supabase/functions/track-session/index.ts`, `supabase/functions/efi-webhook/index.ts`
- migration: add 5 columns to `visitor_sessions`
- secrets: `TIKTOK_PIXEL_ID`, `TIKTOK_ACCESS_TOKEN` (+ optional test code)
