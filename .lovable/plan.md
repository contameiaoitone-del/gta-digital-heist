

## Fix Close Friends fonts — use Bebas Neue instead of Teko

### Problem
The page uses `font-heading` class throughout, which maps to **Teko** in the Tailwind config. The original design requires **Bebas Neue** for all display/heading text. In the Tailwind config, Bebas Neue is mapped to `font-gta`.

### Solution

**`src/pages/CloseFriends.tsx`** — Replace all instances of `font-heading` with `font-gta` (which maps to Bebas Neue).

This affects approximately 15 occurrences:
- Hero h1 (line 151)
- Section h2s (lines 178, 200, 225, 247, 282, 319, 340, 362, 396, 419, 434, 452)
- Value table price row (lines 379-380)
- Sticky bar price (line 486)

Single find-and-replace: `font-heading` → `font-gta` across the file.

`font-body` (Barlow) is already correct and stays as-is.

