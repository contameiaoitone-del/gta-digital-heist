
ALTER TABLE public.visitor_sessions
  ADD COLUMN IF NOT EXISTS event_id_pageview text,
  ADD COLUMN IF NOT EXISTS event_id_initiate text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS fbclid text;

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_sck ON public.visitor_sessions(sck);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS event_id_purchase text;

CREATE INDEX IF NOT EXISTS idx_orders_session_id ON public.orders(session_id);
