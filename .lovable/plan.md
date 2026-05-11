## Visão geral

Vou expandir o cadastro de aulas/módulos com 4 grandes melhorias, mantendo o painel admin já existente e a página de aula da área de membros.

---

## 1. Múltiplos botões de CTA por aula (com reordenação)

**Hoje:** existe um único botão (`cta_enabled`, `cta_label`, `cta_url`).

**Mudança:**
- Nova tabela `lesson_ctas` (lesson_id, label, url, position) — permite N botões com ordem arbitrária.
- Migração mantém os dados atuais: copia `cta_*` existentes para a nova tabela.
- No admin, a seção "Botões de redirect" passa a listar os botões cadastrados, com:
  - Botão "+ Adicionar botão"
  - Setas ↑/↓ para reordenar
  - Botão de excluir
  - Campos: texto e URL
- Na página da aula, renderiza todos os botões em ordem, centralizados, com a setinha diagonal `ArrowUpRight`.

---

## 2. Reorganização do cadastro: "Conteúdo da aula"

Nova UI dentro do form de aula:

```text
▼ Conteúdo da aula
   ▸ Vídeo
       [toggle OFF] Adicionar URL de YouTube → input URL (aparece se ON)
       [toggle OFF] Adicionar URL Vturb     → textarea embed (aparece se ON)
   ▸ Conteúdo em texto
       [toggle OFF] Habilitar conteúdo apenas em texto
           ↓ se ON:
           - Upload de imagem de cabeçalho (banner full-width)
           - Textarea longo redimensionável (vertical resize)
           - Upload de anexos (documentos)
```

Todos os toggles começam **desligados** por padrão em aulas novas.

**Modo texto:** quando habilitado, a página da aula esconde o player e mostra:
- Imagem de cabeçalho cobrindo o topo (mesmo tamanho do vídeo) com gradiente preto na parte inferior (igual ao hero do membros).
- Texto longo abaixo (com `linkify` já existente).
- Lista de documentos anexados para download.

**Modo vídeo:** continua funcionando como hoje. Adiciona também a seção de **anexos** (sempre disponível, mesmo no modo vídeo) — permite upload de arquivos para download.

---

## 3. Upload de arquivos/anexos

- Novo bucket público `lesson-attachments` (ou private com signed URLs — vou usar público para simplicidade de download direto, igual ao `module-covers`).
- Nova tabela `lesson_attachments` (lesson_id, name, file_url, size_bytes, mime, position).
- No admin: drag & drop simples com lista; permite remover.
- Na página da aula: card "Materiais da aula" com lista de arquivos para baixar.

---

## 4. Agendamento de liberação (drip content)

Novo conceito: **liberação imediata** ou **N dias após o pagamento** (drip).

**Schema:**
- `modules.release_days INT NOT NULL DEFAULT 0` (0 = imediato)
- `lessons.release_days INT NOT NULL DEFAULT 0`

**Como saber a data do pagamento?** Já existe `member_access.granted_at`. Vou usar essa data como referência para o "drip" do produto correspondente.

**Lógica de acesso (frontend + servidor):**
- Função SQL `is_drip_unlocked(_user_id, _product, _release_days)` que retorna `true` se `now() >= granted_at + release_days * INTERVAL '1 day'`.
- Atualizar policy de `lessons` e `modules` para também checar drip (somente para `published`; `coming_soon` continua bloqueado).
- Na UI:
  - Se ainda não liberado por drip → mostra badge "Libera em X dias" e bloqueia clique (similar ao "Em breve", mas com contagem).
  - Página da aula bloqueada renderiza "Esta aula libera em X dias" se acessada antes do prazo.
- No admin: novo campo "Liberação" com select (Imediata / Após N dias) e input numérico.

---

## Arquivos afetados

**Migração SQL** (uma só):
- `lesson_ctas` (nova tabela + RLS + copia dados de `lessons.cta_*`)
- `lesson_attachments` (nova tabela + RLS)
- bucket `lesson-attachments` + policies (público para read, admin para write)
- `modules.release_days`, `lessons.release_days`
- `lessons`: `content_mode` (`'video' | 'text'`), `header_image_url`, `text_content`
- Função `is_drip_unlocked` + atualização das policies de `lessons` e `modules`.

**Frontend:**
- `src/pages/admin/Admin.tsx` — novo formulário de aula (CTAs múltiplos, conteúdo da aula com toggles, anexos, release_days nos módulos e aulas).
- `src/pages/membros/Aula.tsx` — renderiza modo texto, lista de CTAs, anexos, bloqueio por drip.
- `src/pages/membros/Modulo.tsx` e `src/pages/membros/Membros.tsx` — exibem badge "Libera em X dias" e bloqueiam acesso.
- `src/components/membros/PosterCard.tsx` — suporta novo estado `lockedDays`.
- `src/integrations/supabase/types.ts` — regenerado pela migração.

---

## Notas técnicas

- Os campos antigos `cta_enabled/cta_label/cta_url` ficarão como **legacy** após a migração (preservados, mas o admin/leitor passará a usar `lesson_ctas`). Mantenho-os para não quebrar nada.
- Anexos e header image vão para o bucket `lesson-attachments` (subpastas por `lesson_id`).
- O drip usa `member_access.granted_at`. Para módulos `mentoria`, considera o acesso `mentoria` ou `mentoria:<module_id>`.
- Toggle de "apenas texto" é exclusivo: se ligado, esconde campos de vídeo e exige imagem de cabeçalho + texto.
- Limites: arquivos até 50MB por upload (Supabase storage default).