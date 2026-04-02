

## Plano: Trocar preço do InfoZap de R$97 para R$67

**Arquivo:** `src/pages/InfoZap.tsx`

Substituir todas as ocorrências de `R$97` por `R$67` nas seguintes partes:

1. **Botões CTA** (linhas ~160, ~487) — texto "R$97" → "R$67"
2. **Preço final na seção de pricing** (linha ~542) — "R$97" → "R$67"
3. **Texto "custo da inação"** (linhas ~562-563) — "Por R$97..." e "...maior do que R$97"
4. **Barra sticky inferior** (linha ~662) — "R$97" → "R$67"
5. **Value stack total riscado** (linha ~538) — ajustar de "R$638" para "R$608" (redução de R$30 no total)
6. **Value stack item "Módulo ZapData Completo"** (linha ~96) — manter R$97 pois é o valor individual riscado do item, não o preço final

Total: ~7 substituições no arquivo.

