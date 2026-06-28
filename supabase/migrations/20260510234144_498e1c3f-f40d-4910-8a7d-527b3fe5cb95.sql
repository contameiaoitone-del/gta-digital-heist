
ALTER TABLE public.payment_settings
  ADD COLUMN IF NOT EXISTS efi_client_id text,
  ADD COLUMN IF NOT EXISTS efi_client_secret text,
  ADD COLUMN IF NOT EXISTS efi_pix_key text,
  ADD COLUMN IF NOT EXISTS efi_payee_code text,
  ADD COLUMN IF NOT EXISTS efi_cert_pem text,
  ADD COLUMN IF NOT EXISTS efi_key_pem text;
