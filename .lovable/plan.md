Diagnóstico confirmado: o pagamento por cartão está travando antes de chamar a função de backend. No navegador apareceu falha ao carregar o script do token de cartão:

```text
GET https://cdn.jsdelivr.net/npm/payment-token-efi@latest/dist/payment-token-efi.umd.min.js
net::ERR_BLOCKED_BY_ORB
```

E não há requisição recente para `efi-create-card`, então o cartão nem está chegando na etapa de cobrança. O problema principal é que o arquivo CDN usado está com o nome errado/instável. A documentação oficial usa:

```text
https://cdn.jsdelivr.net/npm/payment-token-efi/dist/payment-token-efi-umd.min.js
```

Além disso, a documentação da Efí indica que `brand` deve ir dentro de `setCreditCardData`, e o código atual não envia a bandeira do cartão.

## Plano de correção

1. Remover a dependência do CDN externo no runtime
   - Instalar o pacote oficial `payment-token-efi` no projeto.
   - Importar/carregar o SDK via Vite/React, em vez de depender de `<script>` externo no checkout.
   - Isso evita erro de CDN, ORB/bloqueio do navegador e demora infinita no botão.

2. Corrigir o fluxo de tokenização do cartão
   - Antes de gerar o `payment_token`, identificar a bandeira com `verifyCardBrand()`.
   - Bloquear cartão com bandeira `unsupported`/inválida e mostrar erro claro para o comprador.
   - Enviar `brand` junto com número, CVV, validade, nome e CPF em `setCreditCardData()`.

3. Adicionar timeout e mensagens melhores no botão de pagamento
   - Se o SDK/tokenização demorar demais, parar o loading automaticamente.
   - Mostrar mensagem objetiva: “Não foi possível validar o cartão. Tente novamente ou use Pix.”
   - Assim o usuário não fica preso com o botão carregando eternamente.

4. Manter o checkout enxuto
   - Não adicionar endereço de cobrança, porque já confirmamos que não é obrigatório para esse endpoint e pode reduzir conversão.
   - Manter os campos atuais: nome, e-mail, telefone, CPF, cartão, validade, CVV, nascimento e parcelas.

5. Verificação depois da implementação
   - Testar se o formulário de cartão abre sem erro de script.
   - Confirmar que o botão não fica em loading infinito.
   - Confirmar que, após gerar `payment_token`, a função de backend `efi-create-card` passa a ser chamada.
   - Se ainda houver recusa/erro depois disso, o próximo diagnóstico será na resposta real da Efí, não mais no carregamento do SDK.