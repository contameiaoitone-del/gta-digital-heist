

## Plano: Imagem mobile diferente para o card ZapData

### Alterações

1. **Copiar a imagem** do upload para `src/assets/zapdata-banner-mobile.png`

2. **`src/pages/Links.tsx`**:
   - Importar a nova imagem: `import zapdataBannerMobile from "@/assets/zapdata-banner-mobile.png"`
   - Adicionar campo `mobileImage` ao objeto ZapData no array `links`: `mobileImage: zapdataBannerMobile`
   - Importar e usar o hook `useIsMobile` de `@/hooks/use-mobile`
   - No render do card com imagem, verificar se existe `mobileImage` e se `isMobile` é true para trocar a source:
     ```
     backgroundImage: `url(${isMobile && link.mobileImage ? link.mobileImage : link.image})`
     ```

