-- Vendas fora do Brasil (Xpag): o pedido passa a registrar a moeda.
-- Aditivo: todos os pedidos existentes ficam BRL (default) e nada muda para eles.
-- amount_cents continua em "centavos da moeda do pedido" (MXN/COP/CLP/USD x100).
alter table gta.orders add column if not exists currency text not null default 'BRL';
notify pgrst, 'reload schema';
