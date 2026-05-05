create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  product text not null,
  amount_cents integer not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_cpf text not null,
  payment_method text not null,
  installments integer,
  efi_txid text,
  efi_charge_id text,
  status text not null default 'pending',
  paid_at timestamptz,
  raw jsonb
);

alter table public.orders enable row level security;

create index orders_efi_txid_idx on public.orders(efi_txid);
create index orders_efi_charge_id_idx on public.orders(efi_charge_id);
create index orders_status_idx on public.orders(status);

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.update_updated_at_column();