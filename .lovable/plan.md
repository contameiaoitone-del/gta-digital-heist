

## Corrigir aspect ratio dos vídeos para horizontal (16:9)

### Problema
Os vídeos originais são horizontais (landscape), mas estão sendo exibidos em aspect ratio 9:16 (vertical), causando resolução ruim e distorção.

### Alteração no `src/pages/InfoZap.tsx`

**Linha 292**: Mudar `paddingBottom: '177.78%'` (9:16) para `paddingBottom: '56.25%'` (16:9 landscape).

**Linha 302**: Mudar `aspect-[9/16]` para `aspect-video` no placeholder.

Isso mantém o grid 2 colunas mas com vídeos horizontais, que ficam maiores e com resolução correta.

