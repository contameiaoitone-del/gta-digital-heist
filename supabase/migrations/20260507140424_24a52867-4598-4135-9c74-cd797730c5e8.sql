
CREATE TABLE public.meta_capi_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_name text NOT NULL,
  event_id text,
  order_id uuid,
  session_id text,
  value numeric,
  status_code int,
  success boolean NOT NULL DEFAULT false,
  meta_response jsonb,
  error text
);

CREATE INDEX idx_meta_capi_log_event_name ON public.meta_capi_log(event_name);
CREATE INDEX idx_meta_capi_log_order_id ON public.meta_capi_log(order_id);
CREATE INDEX idx_meta_capi_log_created_at ON public.meta_capi_log(created_at DESC);
CREATE INDEX idx_meta_capi_log_event_id ON public.meta_capi_log(event_id);

ALTER TABLE public.meta_capi_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages capi log"
ON public.meta_capi_log
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins view capi log"
ON public.meta_capi_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS meta_purchase_sent_at timestamptz;
