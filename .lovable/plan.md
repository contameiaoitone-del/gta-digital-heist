

## Adicionar seção "Resultados Reais" após o Mecanismo

### O que será feito

Inserir uma nova seção completa entre a seção MECHANISM (linha 223) e MODULES (linha 225) no `src/pages/InfoZap.tsx`.

### Estrutura da seção

**Header:**
- Label verde: "RESULTADOS REAIS"
- Headline: "Não é promessa. É o que já está acontecendo."
- Subheadline cinza: "Alunos reais. Resultados reais. Sem edição, sem seleção, sem mentira."

**Bloco 1 — Seus números**
Grid 2x2 com 4 cards estilo stat (`#141414` bg, borda `#222`):
- 🔥 Mais de 140 alunos já aplicando o método
- 💸 [Seu faturamento total aqui] (placeholder para o usuário preencher)
- 📈 Taxa de conversão de 20-30% nos funis
- 🔒 Zero reembolso com o modelo Pay After Delivery

**Bloco 2 — Depoimentos em vídeo**
- Subtítulo: "Depoimentos em vídeo"
- Grid responsivo (1-col mobile, 2-col md, 3-col lg) com thumbnails placeholder
- Cada card terá uma área de thumbnail cinza com ícone Play, nome e resultado embaixo
- Dados iniciais como placeholder para o usuário substituir com vídeos reais

**Bloco 3 — Prints de resultado**
- Subtítulo: "Prints de resultado"
- Grid responsivo usando os assets `result-1.jpeg` até `result-7.jpeg` já existentes no projeto
- Legenda curta embaixo de cada print

**Fechamento:**
- Texto em itálico/destaque: "Essas pessoas estavam exatamente onde você está agora. Sem experiência, sem audiência, sem capital alto. **A diferença entre eles e você é uma decisão.**"

### Arquivo
- `src/pages/InfoZap.tsx`:
  - Adicionar imports dos assets `result-1` a `result-7`
  - Adicionar arrays de dados para vídeos placeholder e prints
  - Inserir a seção nova após linha 223 (fim do MECHANISM)

### Estilo
- Mesmo padrão visual das outras seções: fundo escuro, cards `#141414`, bordas `#222`, textos em cinza e destaques em verde/branco
- Play icon usando Lucide `Play`

