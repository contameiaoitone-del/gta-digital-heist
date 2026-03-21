

## Copiar seção de resultados do InfoZap para o Close Friends

### O que muda

Substituir a seção 5 (Prova Social) do Close Friends pelo conteúdo completo da seção "Resultados Reais" do InfoZap, incluindo vídeos e carrossel de prints.

### Mudanças em `src/pages/CloseFriends.tsx`

**1. Adicionar imports** (topo do arquivo):
- `useCallback` do React
- `useEmblaCarousel` e `Autoplay`
- `ChevronLeft`, `ChevronRight`, `Play` do lucide-react
- Assets de resultado: `result1` a `result7` de `@/assets/result-*.jpeg`

**2. Adicionar dados** (junto com as outras constantes):
- Array `videoTestimonials` (4 vídeos: Saulo, Gilson, Eric, Alunos comemorando — mesmos videoIds do InfoZap)
- Array `resultPrints` (7 prints com captions — mesmo do InfoZap)

**3. Adicionar lógica no componente**:
- Inicializar `useEmblaCarousel` com loop + autoplay para o carrossel de prints
- Funções `scrollPrintsPrev` / `scrollPrintsNext`

**4. Substituir seção 5** (linhas ~259-285):

Manter o header (label "RESULTADOS REAIS" + headline + stats grid), mas **expandir o container para `max-w-6xl`** e substituir o placeholder `[PRINTS DOS MEMBROS AQUI]` por:

- **Stats cards** — manter os 4 existentes (adaptando cores para rosa `#ff2d78` como já está)
- **"Depoimentos em vídeo"** — grid 2x2 com 4 iframes PandaVideo 16:9, nome e resultado verde abaixo de cada
- **"Prints de resultado"** — carrossel Embla com 7 prints, botões prev/next em rosa, legendas bold
- **Texto de fechamento** — manter o existente

O layout e estilo seguem exatamente o padrão do InfoZap mas com as cores do Close Friends (rosa `#ff2d78` nos botões de navegação em vez de verde).

