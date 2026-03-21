

## Atualizar Bônus e Stack de Valor do InfoZap

### Alterações em `src/pages/InfoZap.tsx`

**1. Atualizar array `bonuses` (linhas 87-91)**
- Remover "Planilha de Lucro" e "Guia de Bancos pra Receber Pix"
- Manter "Free Trial 3 Dias ZapData" como Bônus 1
- Adicionar "3 Produtos Validados + Funis Prontos" como Bônus 2 (valor R$197, resolve "Não saber o que vender nem como montar o funil")

**2. Atualizar array `valueStack` (linhas 93-100)**
- Remover "Planilha de Lucro" (R$47) e "Guia de Bancos" (R$27)
- Atualizar "3 Funis Prontos + Produtos" para "3 Funis Prontos + Produtos Validados"
- Adicionar "Free Trial ZapData 3 dias" (R$47)
- Valor total passa de R$712 para R$638

**3. Atualizar total exibido na seção de value stack**
- Verificar se o total é calculado dinamicamente ou hardcoded e ajustar para R$638

