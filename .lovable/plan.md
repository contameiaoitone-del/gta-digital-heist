Três ajustes na área de membros para ficar mais Netflix + branding InfoZap.

## 1. Trocar "Real Life Academy" por "INFOZAP"
Arquivos atualizados:
- `Membros.tsx` — logo do header passa a ser "INFOZAP" (verde #00ff88), e o badge do billboard muda de "R · Real Life Academy" para "I · InfoZap". Title da aba também.
- `Modulo.tsx`, `Aula.tsx`, `MembrosLogin.tsx`, `Admin.tsx` — atualizar `document.title` para "— InfoZap".

## 2. Banner do topo menor e mais bonito (estilo Netflix real)
O banner atual ocupa 78vh (tela inteira) e usa `background-image` com `bg-cover`, o que estica capas verticais (2:3) e fica feio.

Mudanças no billboard (`Membros.tsx`):
- Altura: de `h-[78vh] min-h-[520px]` para `h-[58vh] min-h-[420px] max-h-[640px]` (≈ 60% mais compacto, igual à billboard da Netflix).
- Trocar o `<div bg-cover>` por uma `<img object-cover object-top>` real para enquadrar melhor.
- Reduzir o título de `text-8xl` para `text-7xl`, descrição de 3 linhas para 2, botões menores (`py-2.5` em vez de `py-3`).
- `pt-16` pra não colar no header fixo.

## 3. Como trocar a imagem do banner
Não dá para criar coluna nova no banco em modo chat. Solução prática (sem migration):
- O banner sempre usa o **primeiro módulo** da lista (já é assim).
- No Admin, adicionar uma nota visível: "O primeiro módulo da lista aparece como banner principal — use as setas ↑↓ para reordenar."
- Para trocar o banner, basta:
  1. Ir no Admin
  2. Mover o módulo desejado para o topo com a setinha ↑
  3. (Opcional) Subir uma capa nova com aspecto melhor

Como o billboard agora usa `object-cover object-top` em vez de `bg-cover bg-center`, mesmo capas verticais ficam bem enquadradas (mostra o topo da imagem, sem distorção).

Se você quiser depois um campo dedicado de "banner 16:9" separado da capa vertical, posso adicionar via migration numa próxima rodada (fica mais flexível mas exige aprovar uma migration).

## Arquivos editados
- `src/pages/membros/Membros.tsx` (header + billboard)
- `src/pages/membros/Modulo.tsx` (title)
- `src/pages/membros/Aula.tsx` (title)
- `src/pages/membros/MembrosLogin.tsx` (title)
- `src/pages/admin/Admin.tsx` (title + nota sobre banner)
