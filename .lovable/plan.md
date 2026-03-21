

## Atualizar Módulos do InfoZap — Conteúdo Expandido

### Problema
Os módulos estão em accordion fechado, escondendo o conteúdo. O usuário quer que pareça como a imagem 2 (todos abertos, mostrando subtópicos).

### Mudanças em `src/pages/InfoZap.tsx`

**1. Atualizar dados dos módulos** (linhas 78-85)
Substituir títulos e subtópicos para corresponder à imagem de referência:
- 01: "Bem-vindo ao InfoZap — Entendendo o Modelo" → subs: operação lowticket, exemplo real do funil, mapa da jornada
- 02: "O que você vai precisar — Setup Completo" → subs: 3 ferramentas (WhatsApp + ZapData + Meta Ads), configurando WhatsApp do zero, free trial ZapData
- 03: "Criando seu Produto — Do Zero ao Funil" → subs: criar infoproduto sem experiência, mineração de oferta, configurando funil no ZapData
- 04: "IA de WhatsApp com ZapData — Automação Completa" → subs: IA pra responder/entregar/cobrar, funil 24h automático, ZapData zero ao avançado
- 05: "Primeiros Anúncios no Meta — Tráfego Pago" → subs atualizados
- 06: "Funis Prontos pra Copiar e Colar" → subs atualizados

**2. Abrir todos os módulos por padrão** (linha 408)
Adicionar `defaultValue` ao `Accordion` com todos os valores: `["mod-0", "mod-1", "mod-2", "mod-3", "mod-4", "mod-5"]` — isso mostra todo o conteúdo imediatamente, maximizando valor percebido.

