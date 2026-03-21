

## Adicionar risco (line-through) nos valores dos bônus e do value stack

### Mudanças em `src/pages/InfoZap.tsx`

1. **Valores dos bônus (linha 516)**: Adicionar `line-through` no valor (`R$47`, `R$197`) para indicar que está incluso sem custo extra

2. **Valores do value stack (linha 535)**: Adicionar `line-through` nos valores individuais (`R$297`, `R$97`, `R$197`, `R$47`) de cada item da tabela

O `R$638` do Valor Total já possui `line-through`. O preço final `R$97` permanece sem risco.

### Detalhes técnicos
- Bônus: mudar `<span>Valor: {b.value}</span>` para incluir `line-through` no valor
- Value stack rows: adicionar `line-through` na classe do `{row.value}`

