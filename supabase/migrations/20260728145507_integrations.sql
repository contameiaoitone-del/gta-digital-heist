-- Admin "Integração": outbound purchase webhooks to external membership
-- areas (e.g. ZZFUNNELS-style purchase-webhook contract). Multi-row config
-- table (one row per destination) + a delivery log for auditing/idempotency.
-- Follows the payment_settings (config) and email-infra (idempotent DDL,
-- service-role log RLS) conventions already used in this project.

CREATE TABLE IF NOT EXISTS public.integrations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  target_url   text NOT NULL,                 -- full URL, incl. ?t=<token> if the destination needs it
  secret       text,                          -- x-webhook-secret
  api_key      text,                          -- JWT used for BOTH `apikey` and `Authorization: Bearer`
  events       text[] NOT NULL DEFAULT '{}',  -- subset of {initiate_checkout,purchase,lead}
  product      text,                          -- optional filter on orders.product (the originating route); NULL = all
  active       boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  updated_by   uuid
);
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins manage integrations"
    ON public.integrations FOR ALL
    USING (public.has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_integrations_active ON public.integrations(active);

CREATE TABLE IF NOT EXISTS public.integration_deliveries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id  uuid NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  order_id        uuid,
  event           text NOT NULL,
  request_body    jsonb,
  response_status int,
  response_body   jsonb,
  magic_link      text,
  error           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (integration_id, order_id, event)      -- idempotency: one attempt per sale per integration per event
);
ALTER TABLE public.integration_deliveries ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins read integration deliveries"
    ON public.integration_deliveries FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role insert integration deliveries"
    ON public.integration_deliveries FOR INSERT
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role update integration deliveries"
    ON public.integration_deliveries FOR UPDATE
    USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_integration_deliveries_created ON public.integration_deliveries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_deliveries_integration ON public.integration_deliveries(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_deliveries_order ON public.integration_deliveries(order_id);
