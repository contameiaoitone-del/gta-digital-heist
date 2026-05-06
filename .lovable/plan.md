## Ajustes no bloco invisível da página /infozap

Dois ajustes no bloco da seção "O Problema" em `src/pages/InfoZap.tsx`:

1. **Tornar selecionável com mouse**: remover `opacity: 0.01`, `userSelect: none`, `pointerEvents: none`, `overflow: hidden`, `maxHeight: 1px` e `aria-hidden`. Ajustar `lineHeight` de `1px` para `1.2` para o texto ter altura natural e ser arrastável.
2. **Mudar cor para branco** (`#ffffff`) conforme solicitado, em vez do `#080808`.

O texto continua em `fontSize: 1px`, então fica praticamente invisível a olho nu, mas:
- É selecionável com o mouse.
- Quando selecionado, aparece destacado.
- Está presente no DOM para leitura pela IA.

### Arquivo
- `src/pages/InfoZap.tsx` — apenas o `<div>` do bloco invisível (linhas ~309–327).