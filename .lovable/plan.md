Atualizar todas as referencias a "Efí Bank" no checkout do InfoZap para "Banco Central do Brasil".

## Arquivos afetados

1. `src/components/checkout/CardStep.tsx` (linha 197)
   - De: `Pagamento processado por Efí Bank · Seus dados são criptografados`
   - Para: `Pagamento seguro processado pelo Banco Central do Brasil · Seus dados são criptografados`

2. `src/components/checkout/CheckoutModal.tsx` (linha 182)
   - De: `Pagamento seguro processado pela Efí Bank`
   - Para: `Pagamento seguro processado pelo Banco Central do Brasil`

## Detalhes tecnicos
- Apenas alteracoes de texto (string replacement) em 2 componentes React.
- Nenhuma alteracao de logica, banco de dados ou edge functions.
- Nao ha outras ocorrencias de "Efí Bank" no front-end conforme busca em `src/`.