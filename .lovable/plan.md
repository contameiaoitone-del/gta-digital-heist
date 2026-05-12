## Diagnóstico

- O pedido `97ed26a0-73ce-4040-808b-e595aea64c44` foi pago corretamente: `status = paid`, `product = lp2_5`, valor `R$5`.
- O acesso foi criado corretamente em `member_access` como `product = treinamento` para o usuário comprado.
- O problema do redirecionamento está no magic link: a função está retornando `redirect_to=https://gta-digital-heist.lovable.app`, sem `/auth/callback?next=/treinamento/membros`. Por isso, depois da autenticação, o navegador cai na home com `/#`.
- O e-mail de acesso também está falhando: a fila tentou enviar, mas recebeu `403 no_matching_sender`, ou seja, o domínio/remetente configurado no envio não corresponde ao domínio de e-mail ativo.

## Plano de correção

1. **Corrigir geração do magic link**
   - Ajustar `auto-login-after-payment` para gerar o link usando o callback completo:
     - `/auth/callback?next=/treinamento/membros`
   - Garantir que `lp2`, `lp2_97`, `lp2_5`, `lp2-97` e `lp2-5` sempre apontem para `treinamento`.
   - Remover dependência de `SITE_URL` incorreto quando ele estiver apontando para domínio/preview errado.

2. **Corrigir fallback do callback de autenticação**
   - Reforçar `AuthCallback` para trocar tokens da URL por sessão antes de navegar.
   - Se o link chegar sem `next`, redirecionar para `/treinamento/membros`, nunca para `/`.
   - Evitar que hash `/#` seja tratado como destino válido.

3. **Corrigir e-mail de acesso**
   - Verificar o domínio de e-mail ativo em Lovable Cloud.
   - Ajustar `send-transactional-email` para usar o sender domain correto (`notify.joaolucasps.co`) em vez de um domínio que não bate com a configuração ativa.
   - Reimplantar as funções necessárias.

4. **Validar com o pedido real**
   - Testar `auto-login-after-payment` no pedido `97ed26a0-73ce-4040-808b-e595aea64c44`.
   - Confirmar que o magic link retornado contém `/auth/callback?next=/treinamento/membros`.
   - Confirmar que a fila de e-mail deixa de registrar `no_matching_sender` para novos envios.

## Resultado esperado

Após pagamento nas páginas de R$5, R$97 e R$147, o comprador será logado e enviado diretamente para `/treinamento/membros`, e o e-mail de acesso será enviado pelo domínio correto.