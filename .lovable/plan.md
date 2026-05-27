## Nova rota: `/lp97-vsl`

Cópia da `/lp2-97` com simplificação no topo: substituir Hero + Problem + WhatYouGet por uma única seção com a VSL (VTurb) e um botão CTA. Restante da página permanece idêntico.

### Arquivos a criar

1. **`src/lp2/components/landing/VslHero.tsx`** — nova seção
   - Container responsivo, padding superior generoso (header free).
   - Placeholder para o script VTurb (um `<div>` com `id` ou comentário `<!-- INSIRA AQUI O CÓDIGO DA VTURB -->`) para você colar depois.
   - Wrapper `max-w-3xl mx-auto aspect-[9/16] md:aspect-video` (ajustável) com borda/sombra padrão da LP.
   - Abaixo do vídeo: botão `variant="hero" size="xl"` com texto **"Quero fazer parte agora"** que faz scroll suave para `#final-cta` (id já existente no `FinalCTA97`).

2. **`src/lp2/pages/IndexVsl97.tsx`** — nova página
   - Ordem das seções:
     ```
     VslHero
     Features
     AboutFounder
     Testimonials
     FinalCTA97
     FAQ
     Footer
     ```
   - Sem Hero original, sem Problem, sem WhatYouGet.

3. **`src/lp2/Lp2AppVsl97.tsx`** — wrapper do app (espelha `Lp2App97.tsx`) renderizando `IndexVsl97`.

### Arquivo a editar

4. **`src/App.tsx`**
   - Adicionar `const Lp2AppVsl97 = lazy(() => import("./lp2/Lp2AppVsl97"));`
   - Adicionar rota: `<Route path="/lp97-vsl" element={<Lp2AppVsl97 />} />` antes da catch-all.

### Garantias

- Nenhuma alteração em `Lp2App97`, `Index97`, `Hero`, `Problem` ou `WhatYouGet` — a rota `/lp2-97` continua exatamente como está.
- Tracking/CTA da página existente (`FinalCTA97`) permanece, então o botão da VSL apenas rola até ele.

### O que você precisará fazer depois

Colar o snippet da VTurb dentro do placeholder em `VslHero.tsx` (vou deixar marcado e comentado).
