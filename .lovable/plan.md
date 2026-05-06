## Layout estilo Netflix com capas dos módulos

### Hoje
A `/membros` mostra um Hero + carrosséis horizontais com **as aulas** (uma row por módulo). Não tem destaque visual para a capa do módulo.

### O que vou fazer

**1. `/membros` — grid de capas dos módulos (estilo Netflix)**
- Hero principal com "continue assistindo" mantido.
- Em vez de carrossel de aulas por módulo, mostrar um **grid de capas dos módulos** (cards 16:9 grandes, estilo "Séries Netflix").
- Cada card mostra: capa (`cover_url`), título, nº de aulas, e barra de progresso agregada do módulo.
- Hover: leve zoom + botão Play no centro.
- Linha "Continue assistindo" continua mostrando **aulas individuais** (pra retomar de onde parou).

**2. Nova página `/membros/modulo/:moduleId` — interior do módulo**
- Header com a capa do módulo em destaque (banner) + título + descrição.
- Botão "Assistir Aula 1" (ou "Continuar do Ep. X").
- Lista vertical de aulas (estilo "Episódios" da Netflix): thumbnail + nº + título + descrição + duração + checkmark se concluída + barra de progresso.
- Clicar em qualquer aula → `/membros/aula/:lessonId` (já existe, toca o vídeo).

**3. Admin (`/admin`)**
- Já permite cadastrar **módulos** (com capa via upload no bucket `module-covers`) e **aulas** (com URL do YouTube — extrai o ID, gera thumb e duração manual).
- Vou só **adicionar dois ajustes**:
  - Aviso visual destacando que a capa do módulo é o que aparece no grid Netflix.
  - Recomendação de proporção 16:9 (ex: 1280×720) pra capa.

Fluxo pra você cadastrar:
1. Admin → "Novo módulo" → título, descrição, **capa 16:9** → publicar.
2. Selecionar o módulo → "Nova aula" → título, **URL do YouTube**, descrição, duração (opcional) → publicar.
3. Repetir aula por aula. Pode reordenar com as setinhas ↑↓.

### Arquivos
- `src/pages/membros/Membros.tsx` — refatorar pra grid de capas.
- `src/pages/membros/Modulo.tsx` — **novo** (página interior do módulo).
- `src/App.tsx` — registrar rota `/membros/modulo/:id`.
- `src/pages/admin/Admin.tsx` — pequeno hint de proporção da capa.

Aprova que eu implemento.
