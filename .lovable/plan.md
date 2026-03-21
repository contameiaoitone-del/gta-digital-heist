

## Converter prints de resultado para slideshow/carousel

### Alteração
Substituir o grid de prints (linhas 292-300) por um carousel com autoplay usando Embla Carousel, igual ao padrão já usado em `TestimonialsSection.tsx` e `Results.tsx`.

### Arquivo: `src/pages/InfoZap.tsx`

1. **Importar** `useEmblaCarousel`, `Autoplay`, `ChevronLeft`, `ChevronRight` (já usados em outros componentes do projeto)
2. **Adicionar hook** `useEmblaCarousel` com `loop: true`, `align: "start"` e `Autoplay({ delay: 3000, stopOnInteraction: false })`
3. **Substituir o grid** por um carousel com:
   - Botões prev/next nas laterais
   - Slides responsivos: 1 por vez mobile, 2 em md, 3 em lg
   - Mesmo estilo de card (`#141414` bg, `#222` border)
   - Autoplay contínuo

