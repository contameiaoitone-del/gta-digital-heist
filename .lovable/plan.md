

## Fix Close Friends Mobile Responsiveness

The page content is being clipped/cut off on mobile (390px viewport). The root cause is large heading font sizes, text overflow, and some layout elements not properly constraining to the viewport width.

### Changes to `src/pages/CloseFriends.tsx`

1. **Hero heading font size** (line 187): Reduce the minimum clamp value from `36px` to `28px` for mobile — `text-[clamp(28px,7vw,72px)]`

2. **Hero bullet points** (line 204): Change from `inline-block w-full` to just `block` to prevent horizontal overflow. Reduce horizontal padding on mobile.

3. **All section headings with large clamp values**: Reduce minimum clamp sizes throughout:
   - Section 2 heading (line 219): `clamp(28px,6vw,60px)`
   - Section 3 heading (line 241): `clamp(26px,5.5vw,56px)`
   - Section 4 headings (lines 266, 277): `clamp(28px,6vw,60px)`
   - Section 5 heading (line 299): `clamp(26px,5.5vw,56px)`
   - Section 6 heading (line 396): `clamp(28px,6vw,60px)`
   - Section 7 heading (line 433): `clamp(28px,6vw,60px)`
   - Section 9 heading (line 476): `clamp(28px,6vw,60px)`
   - Section 12 heading (line 548): `clamp(26px,6vw,56px)`
   - Section 13 heading (line 566): `clamp(28px,6vw,60px)`

4. **"Não é pra você" box** (line 454): Reduce the fixed `text-[32px]` to use clamp — `text-[clamp(24px,5vw,32px)]`

5. **Value stack table** (lines 493-494): Reduce `text-[28px]` to `text-[clamp(22px,5vw,28px)]` for the "Você paga" row

6. **Sticky bar** (line 594): Ensure proper padding on small screens — reduce `px-6` to `px-4` and ensure CTAButton text doesn't overflow

These are all CSS-level tweaks in a single file to ensure text wraps properly and doesn't exceed the 390px mobile viewport.

