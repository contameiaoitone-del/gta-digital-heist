

## Melhorar layout dos vídeos e prints de resultado

### Problemas atuais
- Vídeos em grid 3 colunas ficam pequenos (aspect-video em cards estreitos)
- Prints com `aspect-square` cortam o conteúdo e ficam pequenos
- Container limitado a `max-w-4xl`

### Alterações no `src/pages/InfoZap.tsx`

**1. Expandir container da seção**
- Mudar `max-w-4xl` para `max-w-6xl` para dar mais espaço

**2. Vídeos — layout maior e mais bonito**
- Mudar grid para `grid-cols-1 md:grid-cols-2` (2 colunas max, não 3) — vídeos maiores
- Usar aspect ratio 9:16 vertical (como na referência da imagem) em vez de `aspect-video`
- Adicionar padding e sombra nos cards
- Limitar altura máxima para não ficar gigante

**3. Prints — carousel maior e melhor**
- Remover `aspect-square`, usar aspect ratio natural da imagem (como na screenshot de referência — prints de WhatsApp são verticais)
- Usar `object-contain` em vez de `object-cover` para não cortar
- Aumentar tamanho dos slides: `flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_33.333%]`
- Adicionar sombra e hover effect nos cards (como na imagem de referência)
- Cards com bordas arredondadas e fundo mais escuro, estilo "phone screenshot"

**4. Melhorar espaçamento e tipografia**
- Subtítulos maiores (`text-2xl`)
- Mais espaço entre blocos

