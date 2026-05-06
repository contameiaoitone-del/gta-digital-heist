## Adicionar bloco invisível na seção Hero da /infozap

Inserir `<HiddenContextBlock />` (já existente) no topo da seção Hero (a primeira dobra com "Método InfoZap" e "Do Zero ao Primeiro Pix em até 7 dias").

### Mudança
Em `src/pages/InfoZap.tsx`, dentro do `<div className="relative z-10 max-w-3xl mx-auto text-center">` da seção Hero (linha ~241), adicionar `<HiddenContextBlock />` como primeiro filho, antes do comentário `{/* Pill */}`.

### Arquivo
- `src/pages/InfoZap.tsx` — 1 inserção (linha ~242).