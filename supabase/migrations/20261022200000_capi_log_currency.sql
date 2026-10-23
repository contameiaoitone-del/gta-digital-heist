-- CAPI Log passa a guardar a MOEDA do evento (a mesma enviada ao Meta; USDT vai como USD).
-- Antes, o painel só descobria a moeda lendo gta.orders, então a venda do upgrade em USDT (pedido do ZZFUNNELS,
-- public.orders) aparecia como R$ 59. Aditivo: linhas antigas ficam null = BRL, exceto as de venda internacional (backfill).
alter table gta.meta_capi_log add column if not exists currency text;

update gta.meta_capi_log l
   set currency = case o.currency when 'USDT' then 'USD' else o.currency end
  from gta.orders o
 where o.id = l.order_id and o.currency <> 'BRL' and l.currency is null;

update gta.meta_capi_log l
   set currency = case o.currency when 'USDT' then 'USD' else o.currency end
  from public.orders o
 where o.id = l.order_id and o.currency <> 'BRL' and l.currency is null;

notify pgrst, 'reload schema';
