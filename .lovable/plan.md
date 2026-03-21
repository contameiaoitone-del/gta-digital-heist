

## Melhorias na Landing Page InfoZap

8 alterações em `src/pages/InfoZap.tsx`:

### 1. HERO — Micro copy (linha 189-191)
Substituir `⚡ Últimas vagas nesse preço · Acesso imediato` por `🔒 Garantia de 7 dias · Acesso imediato · Sem mensalidade`

### 2. SEÇÃO DO PROBLEMA — Texto com destaque (linhas 214-239)
- Aumentar fonte dos parágrafos de `text-sm` para `text-[17px]`
- Adicionar mais espaço entre parágrafos: `space-y-4` → `space-y-6`
- Colorir "Drop", "Afiliado", "Tráfego direto" e "Gestão de tráfego" em verde (#00ff88) nos `<strong>` tags

### 3. CARDS DE PROVA SOCIAL — Reformatar (linhas 54-59 e 289-296)
Atualizar `statsCards` para ter número grande + descrição:
```
[
  { number: "+140", desc: "Alunos já aplicando o método" },
  { number: "20-30%", desc: "Taxa de conversão nos funis" },
  { number: "R$0", desc: "Reembolso com o modelo Pay After" },
  { number: "R$Xk", desc: "Faturamento gerado pelos alunos" },
]
```
Renderizar com número grande em verde no topo e descrição menor embaixo (layout vertical centrado).

### 4. MÓDULO 06 — Corrigir subs (linha 84)
Substituir subs do módulo 06 por:
- "3 produtos digitais já validados no mercado"
- "3 funis completos prontos pra importar no ZapData"
- "Criativos dos funis inclusos"

### 5. CUSTO DA INAÇÃO — Novo texto (linhas 489-491)
Substituir pelo texto completo fornecido, com múltiplos parágrafos.

### 6. "NÃO É PRA VOCÊ" — Novos itens (linhas 99-104 e 509-511)
Atualizar `notForYouItems` com os 4 novos itens e o fechamento positivo com o novo texto.

### 7. FAQ — Novas respostas (linhas 106-113)
Substituir array `faqs` com as 6 perguntas e respostas fornecidas.

### 8. CTA FINAL — Novo texto (linhas 541-542)
Substituir parágrafo pelo novo texto fornecido.

