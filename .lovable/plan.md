## Criar usuário de teste com acesso pago

Vou criar o usuário `testecaio@gmail.com` (senha `senha123`) como se ele tivesse comprado o InfoZap:

1. Criar usuário no Auth com email já confirmado (via admin API).
2. Criar registro em `public.profiles`.
3. Inserir em `public.member_access` com `product = 'infozap'` e `active = true` — isso libera o acesso à área de membros igual a um pagamento aprovado.

Sem registro de pedido fake na tabela `orders` (não é necessário para liberar acesso). Se quiser também simular um `order` pago, me avisa.

Aprova que eu executo.
