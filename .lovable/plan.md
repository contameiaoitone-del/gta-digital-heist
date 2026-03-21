

## Fix: CTA button text overflow

The button text "🔥 Quero acessar o Real Zap Academy" is overflowing because the button uses `whitespace-nowrap` (from the base `buttonVariants` in `button.tsx`), which prevents text wrapping on small screens.

### Changes

**`src/pages/RealZapAcademy.tsx`** (line 161):
- Add `whitespace-normal text-center` to the button className to override the default `whitespace-nowrap` and allow text to wrap inside the button on mobile screens.

