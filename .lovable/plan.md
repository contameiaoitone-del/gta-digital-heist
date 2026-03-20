

## Redesign da Seção de Dor (Pain) da InfoZap

### O que muda

A seção atual tem items simples com apenas o texto da dor. A nova versão (conforme screenshot) inclui:

1. **Subtítulo** após o H2: "Se qualquer uma dessas frases já passou pela sua cabeça, você está exatamente no lugar certo."

2. **Pain items expandidos** — cada item agora tem o texto principal em **bold** entre aspas + uma explicação complementar em cinza:
   - "Já comprei curso, não saiu nada do papel" — você assistiu tudo, anotou tudo, mas na hora de executar travou
   - "Tentei drop mas o lucro nunca aparecia" — produto físico, frete, devolução, reclamação, margem zero
   - "Virei afiliado mas não consegui vender nada" — dependendo de produto de terceiro, comissão baixa, concorrência absurda
   - "Não sei por onde começar de verdade" — tanta coisa na internet que paralisa em vez de ajudar
   - "Não tenho dinheiro pra arriscar mais" — já gastou e não viu retorno, não quer repetir o erro

3. **Cards com ícone ✗ rosa** (não mais border-left, mas cards com borda completa e X icon)

4. **Parágrafo de fechamento** atualizado com duas partes:
   - "A verdade que ninguém te conta: **a maioria dos modelos de ganhar dinheiro online foi feita pra quem já tem capital, já tem audiência ou já tem experiência.** Pra quem está começando do zero, é armadilha."
   - "O InfoZap foi construído do zero pensando em quem está exatamente onde você está agora."

### Arquivo
- `src/pages/InfoZap.tsx`:
  - Atualizar o array `painItems` para incluir `title` e `desc` em cada item
  - Redesenhar os cards da seção PAIN com ícone X, título bold entre aspas e descrição
  - Atualizar os parágrafos de fechamento

