

## Criar página Real Zap Academy

Clonar a estrutura do InfoZap e criar uma nova página com toda a copy fornecida.

### Arquivo: `src/pages/RealZapAcademy.tsx`

Novo arquivo clonando a estrutura do InfoZap com as seguintes mudanças:

- **CHECKOUT_BASE**: `https://pay.cakto.com.br/35g8dhq_697665` (Real Life Academy link, R$397)
- **Toda a copy** substituída conforme fornecido (Hero, Pain/Identificação, Inimigo, Mecanismo, Prova Social, Módulos, Bônus, Stack de Valor, Quem Sou Eu, Custo da Inação, Não é pra você, Garantia, CTA Final, FAQ)
- **Módulos**: 11 módulos (6 base + 5 avançados) com separação visual "MÓDULOS BASE" e "MÓDULOS AVANÇADOS"
- **Bônus**: 5 bônus (vs 2 no InfoZap)
- **Value Stack**: 7 itens, total R$1.379, preço R$397
- **Preço**: R$397 em todos os CTAs e sticky bar
- **Seção Pain**: Reformulada com dois blocos "Se você está começando" e "Se você já vende" em vez dos 5 bullets
- **Seção Inimigo**: Nova seção com 5 blocos ❌ (modelo errado, curso ruim, métricas, WhatsApp, criativos)
- **Footer**: "© 2025 Real Zap Academy"
- Mesmos assets reutilizados (cityBackground, caioDalcinPhoto, module covers, result prints, video testimonials)

### Arquivo: `src/App.tsx`

Adicionar rota `/real-zap-academy` apontando para o novo componente.

### Detalhes técnicos

- Mesma estrutura de componentes (CTAButton, sticky bar, embla carousel)
- Mesmas cores (GREEN `#00ff88`, PINK `#ff2d78`)
- Mesma tipografia (Bebas Neue, Barlow)
- Mesmos hooks (useCheckoutUrl, useEmblaCarousel)
- Reutiliza todos os assets existentes do InfoZap

