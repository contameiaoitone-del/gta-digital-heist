
## Plano: Adicionar Card do Realbot na Página de Links

### Alterações Necessárias

#### 1. Copiar a Imagem do Logo Realbot
- Copiar a imagem do logo do Realbot para `src/assets/realbot-banner.png`
- A imagem será usada como banner do card, similar aos outros produtos

#### 2. Atualizar `src/pages/Links.tsx`

**Adicionar import:**
```typescript
import realbotBanner from "@/assets/realbot-banner.png";
```

**Adicionar novo item no array `links`:**
```typescript
{
  name: "Real Bot",
  url: "https://realbot.com.br/",
  icon: ExternalLink,
  description: "Automação inteligente",
  image: realbotBanner,
}
```

### Ordem dos Cards (Atualizada)

| Posição | Produto | Link |
|---------|---------|------|
| 1 | Real Life Academy | `/` (interno) |
| 2 | RP Close | `/rp-close` (interno) |
| 3 | RP Zap | `/rp-zap` (interno) |
| 4 | **Real Bot** | `https://realbot.com.br/` (externo) |

### Resultado Visual

O novo card do Realbot aparecerá na página `/links` com:
- Banner usando a imagem do logo fornecida
- Ícone de link externo no canto
- Link abrindo em nova aba (`target="_blank"`)
- Estilo consistente com os outros cards (borda GTA, efeitos hover)
