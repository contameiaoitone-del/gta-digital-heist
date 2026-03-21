

## Redesign completo da seção Mecanismo

### O que muda
Substituir a seção "O Mecanismo" atual (3 cards simples) por uma seção expandida com texto explicativo sobre o modelo Pay After Delivery + 6 cards de benefícios com emojis.

### Arquivo: `src/pages/InfoZap.tsx`

**1. Remover o array `mechanisms`** (linhas 25-29) — não será mais usado.

**2. Substituir a seção MECHANISM inteira** (linhas 186-203) por:

- **Título**: "Por que o InfoZap funciona quando tudo mais falhou?"
- **3 parágrafos explicativos** sobre o modelo Pay After Delivery (texto em `text-gray-400`)
- **Destaque**: "O InfoZap inverte essa lógica completamente." em bold branco
- **Estatística**: "taxa de conversão de 20 a 30%" em destaque verde
- **Subtítulo**: "E as consequências disso mudam tudo:"
- **6 cards de benefícios** em grid 1-col mobile / 2-col desktop:
  - 💸 Começa com R$15 por dia
  - 🔒 Zero reembolso
  - 💰 Liquidez imediata
  - 🤖 Funil 100% automático com IA
  - 🎯 Campanha que vira máquina de vendas
  - 📈 De zero a R$1.000 por dia em menos de 1 mês

Cada card terá emoji, título bold e descrição em cinza, com borda sutil e fundo `#141414`.

