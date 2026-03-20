

## InfoZap Landing Page

### Overview
Create a new landing page at `/infozap` based on the RP Zap page structure but with a completely new visual identity (green neon #00ff88, rosa #ff2d78, dark #080808) and all the content sections specified in the prompt.

### Technical Approach

**New files to create:**
- `src/pages/InfoZap.tsx` — Main page component with all 15 sections

**Files to modify:**
- `src/App.tsx` — Add route `/infozap`
- `src/index.css` — Add CSS variables for InfoZap colors and marquee animation

### Sections (in order)

1. **Topbar** — Fixed green neon bar with access/guarantee info
2. **Marquee social proof** — Infinite scrolling marquee with green highlights
3. **Hero** — Pill badge, H1 with rosa highlight on "não funcionou?", subtitle, CTA button (green neon, black text), micro copy
4. **Pain section** — "O PROBLEMA" label, 5 pain items with rosa left border
5. **Mechanism** — 3 cards (WhatsApp, Lowticket, Pay After) with green top border on #0f0f0f bg
6. **Modules** — 6 modules as accordion with green numbers, arrow sub-items
7. **Bonus** — 3 horizontal bonus cards with values in green, on #0f0f0f bg
8. **Value Stack** — Table listing items + values, crossed total R$712, green R$97, CTA button
9. **Cost of Inaction** — Yellow/rosa gradient bg, warning about staying still
10. **Not for You** — Rosa bg block with ✗ list
11. **Guarantee** — Card with green border, giant "7" decorative, guarantee text
12. **Final CTA** — Centered on #0f0f0f, question + CTA
13. **FAQ** — 6 questions in accordion
14. **Footer** — Rights, links, disclaimer
15. **Sticky CTA Bar** — Appears after scrolling past hero, fixed bottom bar

### Design System (scoped to page)
- All styling inline/Tailwind within the component — no global CSS pollution
- Green neon: `#00ff88`, Rosa: `#ff2d78`, Background: `#080808`, Cards: `#141414`, Alt bg: `#0f0f0f`
- Fonts: Bebas Neue + Barlow (already loaded as `font-gta` and body font)
- Noise texture: reuse existing `noise-texture` class
- Marquee: CSS keyframe animation added to index.css
- Sticky CTA: `useEffect` with `IntersectionObserver` on hero section
- Smooth scroll: `scroll-smooth` on container
- Checkout URL: reuse `useCheckoutUrl` hook with same Cakto link as RP Zap (or new one if provided)

### Routing
- Add `<Route path="/infozap" element={<InfoZap />} />` in App.tsx

