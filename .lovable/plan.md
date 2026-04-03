

## Plano: Migrar toda a copy e conteúdo do Real Zap Academy para a página InfoZap

A ideia é substituir toda a copy, promessa, módulos, bônus, FAQs e seções da página `/infozap` pelo conteúdo completo do Real Zap Academy — mantendo o preço de R$67, o link de checkout do InfoZap e o nome do componente/rota.

### O que muda no arquivo `src/pages/InfoZap.tsx`:

**1. Dados (arrays de conteúdo):**
- `painItems` → substituir pelos `enemyBlocks` do RZA (5 itens sobre modelo errado, curso ruim, métricas, WhatsApp travando, campanha morrendo)
- `modules` (6 módulos) → substituir por `baseModules` (6) + `advancedModules` (5) = 11 módulos do RZA
- `bonuses` (2) → substituir pelos 5 bônus do RZA (Free Trial, Produtos Validados, Planilha de Lucro, Grupo Networking, Comunidade VIP)
- `valueStack` (4 itens, total R$608) → substituir pelos 7 itens do RZA (total R$1.379), mantendo preço final R$67
- `notForYouItems` (4) → substituir pelos 5 itens do RZA
- `faqs` (6) → substituir pelas 7 FAQs do RZA (adaptando referências de "Real Zap Academy" para "InfoZap" e preço para R$67)
- `mechanismBenefits` → substituir pela versão do RZA (textos mais curtos e diretos)
- `statsCards` → substituir pela versão do RZA (inclui "R$1.000/dia em menos de 30 dias")

**2. Hero:**
- Pill: "🏆 Treinamento Completo — InfoZap" (adaptar do RZA)
- Headline: "O treinamento mais completo de LowTicket no WhatsApp — do zero a R$1.000/dia"
- Subtítulos: usar os 5 bullet points do RZA (primeiro Pix à escala, métricas, escala WhatsApp, tráfego, comunidade)

**3. Seção Pain:**
- Substituir pela estrutura do RZA com dois blocos (iniciante / já vende) + enemy blocks
- Texto de fechamento: "O InfoZap foi." (em vez de "Real Zap Academy foi")

**4. Seção Mecanismo:**
- Usar headline e intro do RZA ("Por que o LowTicket no WhatsApp é o modelo mais completo pra qualquer nível")

**5. Seção Módulos:**
- Adicionar componente `ModuleList` (já existe no RZA) para renderizar módulos base e avançados separadamente
- Labels: "📚 MÓDULOS BASE" e "🚀 MÓDULOS AVANÇADOS"

**6. Seção Custo da Inação:**
- Substituir pelo texto do RZA adaptado para R$67

**7. CTA Final:**
- Usar copy do RZA ("sem resultado, sem crescimento, sem domínio da operação")

**8. Sticky bar e CTAs:**
- Manter preço R$67 em todos os botões
- Manter link de checkout do InfoZap

### O que NÃO muda:
- Preço: R$67
- `CHECKOUT_BASE`: mantém o link do InfoZap
- Rota `/infozap`
- Nome do componente `InfoZap`
- Assets de capas de módulo (mesmas 5 imagens)
- Footer copyright "InfoZap"

### Resumo técnico:
- 1 arquivo alterado: `src/pages/InfoZap.tsx`
- Substituição completa dos arrays de dados e da copy das seções JSX
- Adição do componente interno `ModuleList` para suportar módulos base + avançados

