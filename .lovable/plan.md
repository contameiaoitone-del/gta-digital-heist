## Objetivo
Melhorar a qualidade da thumbnail das aulas VTurb na lista "Continue assistindo" (e demais carrosséis), com fallback automático em HD e opção de upload manual no admin.

## Mudanças

### 1) Fallback HD automático para VTurb (frontend)
Em `src/pages/membros/Membros.tsx` (e reaproveitar em `Modulo.tsx` se aplicável):
- Substituir `vturbThumb()` para gerar a URL em alta resolução do CDN da VTurb:
  - `https://images.converteai.net/{accountId}/players/{playerId}/thumbnail.jpg`
- Renderizar via novo helper `<SmartThumb>` (componente leve em `src/components/membros/SmartThumb.tsx`) que:
  - Tenta a URL HD principal.
  - Em caso de erro de carregamento (`onError`), faz fallback para a versão padrão `thumbnail.jpg` da VTurb e, se também falhar, para a capa do módulo.
- Aplicar o `SmartThumb` no `EpisodeCard` (substituindo o `<img>` atual) sem mudar layout.

### 2) Upload manual de capa por aula (admin)
Em `src/pages/admin/Admin.tsx`, dentro do bloco do form de aula (logo após o campo VTurb, ~linha 700):
- Adicionar novo `Field "Capa personalizada da aula (opcional — sobrescreve a thumbnail automática)"`.
- Reutilizar o helper `uploadLessonFile()` já existente (bucket `lesson-attachments`, público).
- Mostrar preview e botão "Remover" para limpar `thumbnail_url`.
- Corrigir `saveLesson` (linha 278): manter `thumbnail_url` manual sem ser sobrescrito quando o vídeo é VTurb. A lógica passa a ser:
  - Se YouTube: usa a thumb do YT automaticamente (mantém comportamento atual).
  - Caso contrário: preserva `editingLesson.thumbnail_url` (manual) ou `null` (deixa o frontend gerar a HD do VTurb).

### 3) Sem mudanças de schema
A coluna `thumbnail_url` em `lessons` já existe e o bucket `lesson-attachments` já está público. Não há migration.

## Resultado
- Aulas VTurb passam a exibir a thumbnail em alta automaticamente, sem ação manual.
- Quando o criador quiser uma capa personalizada (ex.: arte custom), basta enviar pelo admin — ela tem prioridade.
- Cascata de fallback: capa manual → VTurb HD → VTurb padrão → capa do módulo.