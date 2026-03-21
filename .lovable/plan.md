

## Criar Landing Page "Close Friends" (`/closefriends`)

### O que será criado

Uma nova landing page em `/closefriends` baseada no HTML fornecido, convertida para React/TypeScript seguindo os padrões do projeto. A página é uma LP de assinatura mensal (R$37/mês) para acesso ao Close Friends do Instagram do Caio Dalcin.

### Arquivos a criar/modificar

**1. Criar `src/pages/CloseFriends.tsx`** (~500 linhas)

Converter o HTML fornecido em um componente React com as seguintes seções:
- **Top bar** rosa com mensagem de urgência
- **Social bar** (marquee animado) com stats
- **Hero** com tag, headline, subtítulo e CTA
- **Seção "O Problema"** com texto persuasivo
- **Seção "O que você vai ver"** com 3 story-cards mockup (grid 3 colunas, 2 no mobile)
- **Seção "O que você recebe"** com feature-list (5 itens com ícone, título e descrição)
- **Seção "Para quem é"** com checklist + bloco "Não é pra você"
- **Seção "Value Stack"** com tabela de valores (line-through nos preços individuais)
- **Bloco de preço** com CTA principal (R$37/mês)
- **Seção "Custo da inação"** com destaque amarelo
- **Garantia** com box estilizado
- **CTA Final** com headline de decisão
- **FAQ** com accordion
- **Footer** simples
- **Sticky CTA bar** fixo no bottom (aparece no scroll)

Estilo: usar variáveis CSS inline ou classes Tailwind mapeando as cores do HTML (`--pink: #ff2d78`, `--green: #00ff88`, `--yellow: #ffe600`, backgrounds escuros). Fontes Bebas Neue e Barlow já estão carregadas no projeto.

O checkout URL será: usar `useCheckoutUrl` hook com a URL base do Cakto que está no HTML (precisa ser definida pelo usuário ou usar placeholder).

**2. Modificar `src/App.tsx`**

Adicionar rota:
```tsx
import CloseFriends from "./pages/CloseFriends";
// ...
<Route path="/closefriends" element={<CloseFriends />} />
```

**3. Modificar `src/pages/Links.tsx`**

Atualizar o card "Close Friends" no array `links` para apontar para `/closefriends` em vez de `/rp-close`.

### Detalhes técnicos
- Sticky CTA: `useState` + `useEffect` com `IntersectionObserver` ou scroll listener para mostrar/esconder
- Marquee: CSS animation `@keyframes marquee` (duplicar itens para loop contínuo)
- Story cards: CSS grid responsivo (3 cols desktop, 2 cols mobile)
- FAQ: Reutilizar componente `Accordion` existente do projeto
- Todas as âncoras CTA apontam para o mesmo checkout URL via `useCheckoutUrl`

