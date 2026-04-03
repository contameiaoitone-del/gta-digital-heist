

## Plano: Reverter seção de Problemas para o formato original do InfoZap

**Arquivo:** `src/pages/InfoZap.tsx`

### O que muda

Substituir a seção PAIN atual (linhas ~245-270) — que usa 2 cards do RZA ("Se você está começando" / "Se você já vende") — pelo formato original do InfoZap mostrado na imagem:

**Heading:**
- Label: "O PROBLEMA"
- Título: "VOCÊ RECONHECE **ALGUMA DESSAS?**"
- Subtexto: "Se qualquer uma dessas frases já passou pela sua cabeça, você está exatamente no lugar certo."

**5 cards com X rosa:**
1. "Já comprei curso e perdi dinheiro"
2. "Tentei drop, tráfego direto, gestão de tráfego, encapsulado... e só sangrei dinheiro"
3. "Virei afiliado mas nunca vi um Pix cair"
4. "Não sei por onde começar de verdade"
5. "Não tenho dinheiro pra arriscar mais"

Cada card com sua descrição completa conforme a imagem.

**Parágrafos de fechamento (após os cards):**
- "A culpa não foi sua..." + explicação detalhada
- 4 blocos em negrito (Drop, Afiliado, Tráfego direto, Gestão de tráfego) explicando por que cada modelo falha
- "Nenhum desses modelos foi feito pra quem está começando do zero..."
- "O InfoZap foi." (em verde)
- Parágrafo final: "Sem estoque. Sem produto físico..." + frase em negrito sobre o Pix

### O que permanece igual
- Seção do Inimigo (linhas 308-336) continua existindo separadamente
- Todas as outras seções inalteradas

