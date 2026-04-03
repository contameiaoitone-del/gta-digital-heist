

## Plano: Mesclar conteúdo do Real Zap Academy no InfoZap

Todas as alterações são no arquivo `src/pages/InfoZap.tsx`.

### 1. Mesclar bullets do Hero
Substituir os 4 bullets atuais do hero pelos 5 bullets do RZA (imagem 122):
- ⚡ Do primeiro Pix à escala completa — tudo numa operação só
- 📊 Métricas, otimização e decisão com dados — sem mais chute
- 📱 Escala de WhatsApp sem bloqueio — chips, rodízio e múltiplos números
- 🎯 Estrutura de Tráfego completa e infálivel
- 🏆 Comunidade VIP + Grupo de networking exclusivo

### 2. Mesclar seção de Problemas (Pain)
Substituir a seção PAIN atual (lista de 5 painItems + texto corrido) por uma versão mesclada:
- Manter o heading "O Problema"
- Usar o heading do RZA: "Seja você iniciante ou já vende — algo está travando você de chegar em R$1.000/dia."
- Incluir os 2 cards do RZA ("Se você está começando" + "Se você já vende") com a copy exata das imagens
- Manter a frase de fechamento: "Nos dois casos o problema é o mesmo: Falta o método completo..."

### 3. Adicionar seção "Inimigo" após o Mecanismo
Inserir uma nova seção entre o Mecanismo e os Resultados Reais, com o conteúdo do RZA (imagem 124):
- Heading: "Por que a maioria não sai do zero — ou trava antes de chegar em R$1.000/dia"
- 5 cards com X rosa (enemyBlocks do RZA): Começou pelo modelo errado, Comprou curso que não entregou, Não sabe ler métricas, Tenta escalar e o WhatsApp trava, Sem estrutura certa de tráfego
- Texto de fechamento: "A culpa não foi sua..." + "O InfoZap foi." (mantendo nome InfoZap)
- Parágrafo final: "Sem modelo complicado... Do primeiro Pix a R$1.000/dia..."

### 4. Substituir seção "O que você aprende"
Substituir integralmente a seção de módulos:
- Heading: "Do primeiro Pix a R$1.000/dia — tudo numa operação só"
- Subtexto do RZA sobre operação completa
- Mesmo carrossel de capas (manter as 5 capas existentes do InfoZap)
- Adicionar componente `ModuleList` do RZA
- Usar `baseModules` (6 módulos) + `advancedModules` (5 módulos) do RZA com labels "📚 MÓDULOS BASE" e "🚀 MÓDULOS AVANÇADOS"

### 5. Substituir Bônus
Trocar os 2 bônus atuais pelos 5 do RZA:
- Free Trial 3 Dias ZapData (R$47)
- 3 Produtos Validados + Funis Prontos (R$197)
- Planilha de Lucro (R$47)
- Grupo de Networking Exclusivo (R$197)
- Comunidade VIP Real Zap Academy (R$97)

### 6. Substituir Value Stack (mantendo preço R$67)
Usar os 7 itens do RZA no value stack:
- Real Zap Academy — 11 módulos completos (R$697)
- Módulo ZapData Completo (R$97)
- 3 Funis Prontos + Produtos Validados (R$197)
- Free Trial ZapData 3 dias (R$47)
- Planilha de Lucro (R$47)
- Grupo de Networking Exclusivo (R$197)
- Comunidade VIP Real Zap Academy (R$97)
- Valor Total riscado: R$1.379
- **Preço final mantido: R$67** (não R$397)
- Remover parcelas 12x — manter formato simples "Você paga hoje → R$67"

### Dados que permanecem iguais
- CHECKOUT_BASE do InfoZap (pay.cakto.com.br/3dsuw79...)
- Preço R$67 em todos os CTAs e sticky bar
- Seções de Resultados, Quem Vai Te Ensinar, Garantia, FAQ, Footer — sem alteração
- Module covers carousel images (5 capas do InfoZap)

