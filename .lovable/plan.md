

## Corrigir botões CTA cortados no mobile

### Problema
Os botões "QUERO MEU ACESSO AGORA — R$97" têm largura fixa (`px-10`) e texto grande (`text-lg`) que ultrapassa a tela de 390px, cortando o conteúdo.

### Solução

**`src/pages/InfoZap.tsx`** — 4 alterações:

1. **CTAButton component (linha 157)**: Tornar responsivo — no mobile usar `w-full px-4 text-base`, no desktop manter `px-10 text-lg`. Mudar de tamanho fixo para `w-full md:w-auto`

2. **CTA Intermediário (linha 486)**: Mesmo tratamento — adicionar `w-full` e reduzir padding/texto no mobile

3. **Value Stack CTA (linha 548)**: Já usa `<CTAButton />`, será corrigido automaticamente

4. **Final CTA (linha 619)**: Já usa `<CTAButton />`, será corrigido automaticamente

5. **Sticky bar button (linha 666)**: Usa `<CTAButton small />` — verificar que `small` variant também tenha `w-full` no mobile

### Detalhes técnicos
- `CTAButton` large: `w-full md:w-auto h-12 md:h-14 px-4 md:px-10 text-base md:text-lg`
- `CTAButton` small: `w-full sm:w-auto h-10 px-4 sm:px-6 text-sm`
- CTA Intermediário standalone: mesmas classes responsivas

