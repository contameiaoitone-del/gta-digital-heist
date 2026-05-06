## Refazer área de membros no estilo Netflix (de verdade)

### O que tá errado hoje
- As capas dos módulos estão em **16:9 horizontal** (formato de "thumb de aula"), mas a Netflix usa **pôster vertical 2:3** (igual cartaz de filme nas referências que você mandou).
- Os módulos estão em **grid de 4 colunas** parado. Netflix é **linha horizontal que rola pro lado** ("My List", "Popular on Netflix", "Continue Watching"...).
- Falta o **hover card grande** (quando passa o mouse a capa cresce e mostra info embaixo).
- Falta o **billboard** ocupando o topo do jeito Netflix (gradiente lateral + logo do módulo + sinopse + Play / Mais informações).

### O que vou fazer

**1. Capas dos módulos viram pôster vertical (2:3)**
- Card `aspect-[2/3]` (ex.: 300×450), `object-cover`, cantos arredondados leves.
- Admin: vou trocar a recomendação de "1280×720 (16:9)" pra **"800×1200 (2:3) — estilo cartaz Netflix"**. As capas atuais que você já subiu continuam funcionando, mas vão aparecer cortadas até você trocar — vou avisar isso na tela.

**2. Linhas horizontais (rows) com scroll**
- Cada seção vira uma `row` com scroll horizontal suave (igual Netflix), sem barra visível, com setas ◀ ▶ que aparecem no hover (desktop) e swipe no mobile.
- Rows que vou criar:
  - **Em destaque** (Billboard no topo)
  - **Continue assistindo** (aulas individuais — capa horizontal 16:9 mesmo, igual Netflix faz com episódios)
  - **Módulos** (capas 2:3 verticais)
  - **Novidades** (módulos mais recentes — opcional, só se tiver +6 módulos)

**3. Hover card (desktop)**
- Quando passar o mouse num pôster por ~300ms: card cresce 1.4x, sai do fluxo, mostra embaixo: Play ▶, ✓ marcar concluído, título grande, nº de aulas, % de progresso, descrição curta.
- Mobile: tap → vai direto pro módulo (sem hover).

**4. Billboard topo (igual Money Heist da sua referência)**
- Mantém imagem de fundo (capa do módulo em destaque), mas:
  - Adiciona "**N** SÉRIE" no topo (vou usar inicial verde "R" da Real Life, no lugar do N vermelho).
  - Match score fake removido. Em vez disso: badge "**Continue de onde parou**" ou "**Novo módulo**".
  - Botões: ▶ **Assistir** (branco) + ⓘ **Mais informações** (cinza translúcido) — exatamente os 2 botões da Netflix.
  - Gradiente lateral mais forte pra esquerda + gradiente embaixo (faz a transição com a primeira row).

**5. Página interior do módulo (`/membros/modulo/:id`)**
- Já existe — vou só ajustar o banner pra usar a capa em modo "wide" (com blur lateral se a capa for vertical) e a lista de aulas continua estilo episódios.

### Detalhes técnicos
- **Arquivos:**
  - `src/pages/membros/Membros.tsx` — refatorar layout (billboard + rows horizontais + cards 2:3 + hover card).
  - `src/pages/membros/Modulo.tsx` — ajustar banner pra capa vertical (background blur + capa centralizada).
  - `src/pages/admin/Admin.tsx` — trocar hint pra "2:3 / 800×1200".
  - Componente novo: `src/components/membros/Row.tsx` (linha horizontal reutilizável com setas).
  - Componente novo: `src/components/membros/PosterCard.tsx` (card 2:3 com hover expand).
- **Sem novas dependências** — uso scroll nativo + Tailwind + Framer Motion (já existe? checo; se não, faço com CSS puro).
- **Sem migração de banco** — tudo é só layout. Suas capas atuais continuam, só ficam melhores quando você re-enviar em 2:3.

Aprova que eu mando?
