Dois ajustes para deixar a área de membros mais Netflix:

## 1. Banner fixo do InfoZap (não mais o primeiro módulo)
Hoje o billboard usa o primeiro módulo, então a imagem fica esquisita (capa vertical esticada) e o título é o nome do módulo.

Mudança em `Membros.tsx`:
- Importar uma imagem dedicada de background do `src/assets/` (vou usar `real-life-academy-banner.png` que é horizontal e cinematográfica — é a melhor candidata existente).
- Hero passa a mostrar SEMPRE:
  - Badge: "I · InfoZap"
  - Título: **INFOZAP** (grande, Bebas Neue)
  - Descrição: "O método completo para escalar produtos digitais no WhatsApp. Tráfego pago, criativos, copy, escala e os bastidores reais de quem fatura todos os dias."
  - Botão "Assistir" → vai para a primeira aula disponível (heroLesson)
  - Botão "Mais informações" → primeiro módulo (ou rola para a grade)
- Mantém `object-cover object-top` + gradients fortes para legibilidade.
- Altura igual a Netflix: `h-[58vh] min-h-[420px] max-h-[640px]`.

## 2. Cards de módulo maiores (mais próximos da Netflix)
Em `PosterCard.tsx`:
- Largura: de `w-[150px] md:w-[200px]` para `w-[180px] md:w-[240px] lg:w-[260px]`.
- Aumenta o título do hover overlay de `text-sm` para `text-base`.

## Arquivos editados
- `src/pages/membros/Membros.tsx` (banner fixo InfoZap + import da imagem)
- `src/components/membros/PosterCard.tsx` (cards maiores)
