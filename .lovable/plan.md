

## Plano: Trocar wallpaper de fundo da página de Links

### Alterações

1. **Copiar imagem** do upload para `src/assets/gta-links-background.png`

2. **Atualizar `src/pages/Links.tsx`**:
   - Trocar import de `gtaHero` (gta-collage-background.png) para a nova imagem
   - O background já é aplicado na div com `backgroundImage`, então basta trocar a referência

