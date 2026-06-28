
-- Singleton settings table (id=1) for payment gateway configuration
CREATE TABLE public.payment_settings (
  id integer PRIMARY KEY DEFAULT 1,
  active_pix_gateway text NOT NULL DEFAULT 'efi' CHECK (active_pix_gateway IN ('efi','zzgate')),
  zzgate_client_id text,
  zzgate_client_secret text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT singleton CHECK (id = 1)
);

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage payment settings"
ON public.payment_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.payment_settings (id, active_pix_gateway) VALUES (1, 'efi') ON CONFLICT (id) DO NOTHING;

-- Add gateway tracking columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS pix_gateway text,
  ADD COLUMN IF NOT EXISTS gateway_txid text;

CREATE INDEX IF NOT EXISTS orders_gateway_txid_idx ON public.orders (gateway_txid);
