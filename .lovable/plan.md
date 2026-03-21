

## Otimização de Performance das Páginas

Após analisar o código, identifiquei os seguintes problemas de performance:

### Problema 1: Todas as páginas carregam juntas (sem code splitting)
O `App.tsx` importa todas as páginas diretamente. Quando o usuário acessa `/real-zap-academy`, o código de **todas** as outras páginas (Index, Links, RPClose, InfoZap, CloseFriends, etc.) também é carregado. Isso aumenta significativamente o bundle inicial.

### Problema 2: Imagens sem lazy loading
As páginas RealZapAcademy e InfoZap importam ~12 imagens cada (module covers + result prints) e todas são carregadas imediatamente, mesmo as que estão fora da tela. Apenas `TestimonialsSection.tsx` usa `loading="lazy"`.

### Problema 3: Muitos assets pesados
Há ~75 arquivos de imagem em `src/assets`, incluindo PNGs grandes (backgrounds, banners, módulos). Todos que são importados em uma página carregam de uma vez.

---

### Plano de otimização

**1. Lazy loading de rotas (`App.tsx`)**
- Usar `React.lazy()` + `Suspense` para todas as páginas
- Cada página vira um chunk separado, carregado sob demanda
- Redução estimada de ~60-70% no bundle inicial

**2. Lazy loading de imagens (`RealZapAcademy.tsx`, `InfoZap.tsx`, `CloseFriends.tsx`, `RPClose.tsx`)**
- Adicionar `loading="lazy"` em todas as `<img>` que não estão no viewport inicial (result prints, module covers, seções abaixo do hero)
- Manter `loading="eager"` apenas para imagens acima da dobra (hero, background)

**3. Lazy loading de imagens na página Links (`Links.tsx`)**
- Adicionar `loading="lazy"` nos banners dos links

### Detalhes técnicos

- `React.lazy` + `Suspense` com fallback simples (spinner ou div vazia)
- `loading="lazy"` é nativo do browser, zero JS extra
- Nenhuma mudança visual — apenas performance

