

## Plano: Trocar card Realbot por ZapData

### Alterações

1. **Copiar imagem** do upload para `src/assets/zapdata-banner.png`

2. **Atualizar `src/pages/Links.tsx`**:
   - Trocar import de `realbotBanner` para `zapdataBanner` apontando para o novo arquivo
   - Atualizar o item no array `links`:
     - name: "ZapData"
     - url: `https://zapdata.co/#/auth?ref=ED8R7J27`
     - description: "Automação de WhatsApp"
     - image: zapdataBanner

3. **Remover** `src/assets/realbot-banner.png` (não mais usado)

### Resultado
O card 4 na página `/links` passará a ser ZapData com a nova imagem e link externo.

