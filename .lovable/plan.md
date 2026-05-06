## Mover bloco invisível do Hero para o topo absoluto da página

Mover o `<HiddenContextBlock color="#080808" />` que está atualmente dentro do `<div>` interno da seção Hero (linha 242) para fora da `<section>`, como primeiro filho do `<div className="min-h-screen ...">` raiz da página (linha 235).

Assim o bloco passa a ser o primeiro elemento renderizado da página, antes do Hero/imagem de fundo.

### Arquivo
- `src/pages/InfoZap.tsx` — mover 1 linha (linha 242 → entre linhas 235 e 236).