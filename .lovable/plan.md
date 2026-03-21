

## Adicionar foto do Caio na seção "Quem Vai Te Ensinar" e no Hero

### Mudanças

1. **Copiar imagem** para `src/assets/caio-dalcin.jpeg`

2. **`src/pages/InfoZap.tsx`** — Importar a imagem e substituir os dois placeholders `[FOTO DO CAIO AQUI]` por `<img>` tags com a foto:
   - **Hero (linha ~189-191)**: Substituir o `<span>` placeholder por `<img>` com `object-cover rounded-full w-full h-full`
   - **Seção "Quem Vai Te Ensinar" (linha ~389-391)**: Mesmo tratamento

