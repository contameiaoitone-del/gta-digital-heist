

## Melhorar legibilidade do texto pequeno no Hero e "Quem Vai Te Ensinar"

### Problema
Os textos menores (subheadlines do hero, garantia, bio do instrutor, descrições das stats) estão com cores muito apagadas (`text-gray-400`, `text-gray-500`, `text-xs`) sobre o background da cidade, dificultando a leitura.

### Solução

**`src/pages/InfoZap.tsx`** — Aplicar as seguintes melhorias:

1. **Subheadlines do Hero (linhas 186-191)**: Mudar de `text-gray-400` para `text-gray-200` e adicionar `text-shadow` sutil para contraste extra

2. **Garantia abaixo do CTA (linha 197-198)**: Mudar de `text-gray-500 text-xs` para `text-gray-300 text-sm` com text-shadow

3. **Bio do instrutor (linhas 399-403)**: Mudar de `text-gray-400` para `text-gray-200` e adicionar background semi-transparente (`rgba(0,0,0,0.4)`) com padding e border-radius no bloco de texto, similar ao que já funciona nas subheadlines do hero

4. **Descrições das stats (linha 414)**: Mudar de `text-gray-500 text-xs` para `text-gray-300 text-sm`

### Resumo técnico
- Clarear cores: `gray-400/500` → `gray-200/300`
- Adicionar `textShadow: "0 1px 4px rgba(0,0,0,0.8)"` nos textos sobre background de imagem
- Fundo semi-transparente no bloco de bio para garantir leitura

