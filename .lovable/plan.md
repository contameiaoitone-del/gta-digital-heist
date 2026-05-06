# Fix tracking issues on /infozap

Three problems to fix, all scoped strictly to the InfoZap funnel.

## 1. Meta Pixel `fbevents.js` not loading

**Cause:** In `src/lib/metaPixel.ts`, `ensurePixel()` does an early-return when `window.fbq` already exists (e.g. left over from the old GTM setup or from a prior navigation). When that happens we never inject `fbevents.js` and never call `fbq("init", PIXEL_ID)`, so no Pixel cookies are set and `track()` calls go nowhere.

**Fix:**
- Always inject the base snippet if `injected` flag is false, regardless of `window.fbq`.
- Always call `window.fbq("init", PIXEL_ID)` at the end (idempotent — Meta dedupes inits per pixel id).
- Use a module-level `Set<string>` of inited pixel ids to avoid double-init for the same id.
- Keep the `<noscript>` fallback in `<body>`, added once.

## 2. `InitiateCheckout` not firing when user picks Pix/Cartão

**Cause:** Today `trackInitiateCheckout` runs inside `submitForm` (CheckoutModal `form → method`). Because the Pixel snippet never fully booted (issue #1), `waitForFbq(2000)` resolves `false`, so `fbq("track", ...)` is a no-op. The CAPI call also fires but with no Pixel-side counterpart, Events Manager shows nothing in real-time.

**Fix:**
- Once issue #1 is fixed, `fbq` will be defined and `InitiateCheckout` will fire client-side.
- Also move the `trackInitiateCheckout` call so it triggers when the user actually lands on the `method` step (not on form submit), which is what the user expects ("when going to choose Pix or card"). Concretely: call it from a `useEffect` in `CheckoutModal` when `step === "method"` and we haven't fired it yet for this modal session.
- Add a `console.debug("[track] InitiateCheckout", { eventId, fbqReady })` line so we can verify in DevTools.

## 3. Missing UTMs in URL on direct entry

**Goal (matches old GTM behavior):** When a user lands on `/infozap` without `utm_source`, rewrite the URL with `utm_source=direct&utm_medium=direct&utm_campaign=direct` (plus an `sck=<sessionId>` for traceability) using `history.replaceState`, so the URL bar reflects the source. When they DO arrive with UTMs, leave them alone but persist them.

**Implementation — new file `src/lib/utmAutoFill.ts`:**
- `ensureUtms()`:
  1. Read current `URLSearchParams`.
  2. Read `_fbc` / `fbclid` to detect paid Meta traffic; if `fbclid` is present and no `utm_source`, set `utm_source=facebook&utm_medium=paid&utm_campaign=meta`.
  3. Otherwise, if `document.referrer` is empty or same-origin → `utm_source=direct&utm_medium=direct&utm_campaign=direct`.
  4. Otherwise, derive `utm_source` from `new URL(document.referrer).hostname` (e.g. `google`, `instagram`, etc.) with `utm_medium=referral`.
  5. Always ensure `sck=<getSessionId()>` is in the URL.
  6. Persist all UTMs to cookies (`cookieUtmSource`, `cookieUtmMedium`, `cookieUtmCampaign`, `cookieUtmContent`, `cookieUtmTerm`) with 30-day expiry — same names already consumed by `useCheckoutUrl.ts`, so checkout links keep working.
  7. Call `history.replaceState({}, "", url.toString())` so the address bar updates without a reload.

**Wire-up:** call `ensureUtms()` from `TrackingProvider` inside the same `if (isTracked)` branch, **before** `init()`. Scoped to `/infozap` only.

## 4. Files touched

- ✏️ `src/lib/metaPixel.ts` — remove early-return when `window.fbq` already exists; track inited pixels in a Set.
- ➕ `src/lib/utmAutoFill.ts` — new helper.
- ✏️ `src/components/TrackingProvider.tsx` — call `ensureUtms()` then `ensurePixel()` then `init()`.
- ✏️ `src/components/checkout/CheckoutModal.tsx` — fire `trackInitiateCheckout` via `useEffect` on `step === "method"` instead of inside `submitForm`; remove duplicate fire.
- ✏️ `src/hooks/useTracking.ts` — add `console.debug` lines for PageView / InitiateCheckout / Purchase to ease debugging.

## 5. Validation steps (after deploy)

1. Open `/infozap` in a clean tab. URL bar should rewrite to `/infozap?utm_source=direct&utm_medium=direct&utm_campaign=direct&sck=...`.
2. DevTools → Network → filter `fbevents.js` → must load with 200.
3. Network → filter `tr/?id=1533634077714814` → must show `ev=PageView`.
4. Click any CTA → fill form → continue → method screen should fire `ev=InitiateCheckout` (Network) and `console.debug("[track] InitiateCheckout", ...)`.
5. Meta Events Manager → Test Events → both PageView and InitiateCheckout show "Browser + Server" (deduped).
6. Open `/` (or any non-InfoZap route) → confirm `fbevents.js` is **not** requested and URL is **not** rewritten.

No DB migrations and no new secrets required — `META_PIXEL_ID`, `META_ACCESS_TOKEN` already configured for CAPI.
