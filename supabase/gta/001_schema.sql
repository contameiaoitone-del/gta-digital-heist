-- =============================================================================
-- gta / 001_schema.sql
--
-- Backend do funil de vendas (gta-digital-heist) dentro de um schema NOVO e
-- ISOLADO chamado `gta`, para rodar num projeto Supabase COMPARTILHADO cujo
-- schema `public` pertence a OUTRO app.
--
-- ADITIVO E ISOLADO:
--   * Tudo o que este arquivo cria vive em `gta.*` e vem qualificado.
--   * Nao le, altera, remove nem concede nada em `public`, `storage`, `vault`,
--     `cron`, `pgmq`. Em `auth` so referencia `auth.users(id)` (FK) e chama
--     `auth.uid()` / `auth.role()` dentro das policies (leitura).
--   * Sem DROP/TRUNCATE de objeto fora do `gta`; so `drop policy/trigger if
--     exists` em tabelas `gta.*`.
--   * Sem `create extension` (gen_random_uuid vem do pg_catalog).
--   * Re-executavel (idempotente): create ... if not exists / or replace.
--
-- ESTADO REPRODUZIDO: o schema VIVO do funil (migrations + _migration/destino
-- 01-schema-apply.sql + 07-rls-hardening.sql), nao so as migrations em
-- supabase/migrations (que sao incompletas, p.ex. visitor_sessions nao tem
-- CREATE TABLE la). Escopo minimo: orders, payment_settings, tracking_pixels,
-- visitor_sessions, meta_capi_log, integrations, integration_deliveries,
-- user_roles (+ has_role / is_super_admin), member_access, member_areas,
-- site_settings. Ficam de fora: aulas/modulos/webauthn/filas de e-mail/
-- share_links/profiles/gateway_webhook_log.
--
-- SEGREDOS: payment_settings (creds Efi/ZZGate, cert/key PEM) e integrations
-- (secret/api_key de webhook) so sao legiveis por service_role (edge functions
-- `payment-settings` / `integrations` mascaram na saida). Nenhum grant nem
-- policy para anon/authenticated nessas duas tabelas.
--
-- RLS: habilitado em TODAS as tabelas. Reproduz o estado "endurecido" da
-- auditoria (07-rls-hardening.sql): user_roles sem policy de escrita,
-- visitor_sessions sem escrita publica (grava so via edge function
-- track-session / assign-session-pixel com service_role), member_areas com
-- insert restrito a master/super_admin e select escopado.
--
-- PRE-REQUISITO FORA DESTE ARQUIVO: expor `gta` no PostgREST (Settings > API >
-- Exposed schemas, ou PATCH /v1/projects/{ref}/postgrest em `db_schema`).
-- O `notify pgrst` no fim so recarrega o cache; nao altera a lista de schemas.
-- =============================================================================

begin;

create schema if not exists gta;
comment on schema gta is 'Funil de vendas gta-digital-heist (isolado do schema public do outro app)';

-- ---------------------------------------------------------------------------
-- Enum de papeis
-- ---------------------------------------------------------------------------
do $$ begin
  create type gta.app_role as enum ('admin', 'student', 'master', 'super_admin');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Trigger helper: updated_at
-- ---------------------------------------------------------------------------
create or replace function gta.update_updated_at_column()
returns trigger
language plpgsql
set search_path = gta, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- user_roles + helpers de papel (precisam existir antes das policies)
-- ---------------------------------------------------------------------------
create table if not exists gta.user_roles (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  role       gta.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- master e super_admin satisfazem qualquer papel (igual ao has_role vivo).
create or replace function gta.has_role(_user_id uuid, _role gta.app_role)
returns boolean
language sql stable security definer
set search_path = gta, pg_temp
as $$
  select exists (
    select 1 from gta.user_roles
    where user_id = _user_id
      and (role = _role or role::text in ('master', 'super_admin'))
  )
$$;

create or replace function gta.is_super_admin(_user_id uuid)
returns boolean
language sql stable security definer
set search_path = gta, pg_temp
as $$
  select exists (
    select 1 from gta.user_roles
    where user_id = _user_id and role::text = 'super_admin'
  )
$$;

-- ---------------------------------------------------------------------------
-- orders
-- (product e texto livre: sem enum/check; produtos novos como lm_low entram sem DDL)
-- ---------------------------------------------------------------------------
create table if not exists gta.orders (
  id                   uuid        primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  product              text        not null,
  amount_cents         integer     not null,
  customer_name        text        not null,
  customer_email       text        not null,
  customer_phone       text        not null,
  customer_cpf         text        not null,
  payment_method       text        not null,
  installments         integer,
  efi_txid             text,
  efi_charge_id        text,
  status               text        not null default 'pending',
  paid_at              timestamptz,
  raw                  jsonb,
  session_id           text,
  event_id_purchase    text,
  meta_purchase_sent_at timestamptz,
  utm_source           text,
  utm_medium           text,
  utm_campaign         text,
  utm_content          text,
  utm_term             text,
  pix_gateway          text,
  gateway_txid         text,
  area_id              uuid
);
create index if not exists orders_efi_txid_idx       on gta.orders (efi_txid);
create index if not exists orders_efi_charge_id_idx  on gta.orders (efi_charge_id);
create index if not exists orders_gateway_txid_idx   on gta.orders (gateway_txid);
create index if not exists orders_status_idx         on gta.orders (status);
create index if not exists idx_orders_session_id     on gta.orders (session_id);

drop trigger if exists orders_set_updated_at on gta.orders;
create trigger orders_set_updated_at
  before update on gta.orders
  for each row execute function gta.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- payment_settings (singleton id=1) -- SEGREDOS, so service_role
-- ---------------------------------------------------------------------------
create table if not exists gta.payment_settings (
  id                   integer     primary key default 1,
  active_pix_gateway   text        not null default 'efi',
  zzgate_client_id     text,
  zzgate_client_secret text,
  updated_at           timestamptz not null default now(),
  updated_by           uuid,
  efi_client_id        text,
  efi_client_secret    text,
  efi_pix_key          text,
  efi_payee_code       text,
  efi_cert_pem         text,
  efi_key_pem          text,
  constraint payment_settings_active_pix_gateway_check check (active_pix_gateway in ('efi', 'zzgate')),
  constraint singleton check (id = 1)
);
insert into gta.payment_settings (id, active_pix_gateway) values (1, 'efi')
  on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- tracking_pixels + RPC publica (so colunas nao secretas)
-- ---------------------------------------------------------------------------
create table if not exists gta.tracking_pixels (
  id           uuid        primary key default gen_random_uuid(),
  platform     text        not null,
  pixel_id     text        not null,
  access_token text,
  label        text,
  active       boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  area_id      uuid,
  constraint tracking_pixels_platform_check check (platform in ('meta', 'tiktok'))
);

drop trigger if exists tracking_pixels_updated_at on gta.tracking_pixels;
create trigger tracking_pixels_updated_at
  before update on gta.tracking_pixels
  for each row execute function gta.update_updated_at_column();

create or replace function gta.get_active_tracking_pixels()
returns table (id uuid, platform text, pixel_id text)
language sql stable security definer
set search_path = gta, pg_temp
as $$
  select id, platform, pixel_id from gta.tracking_pixels where active = true
$$;

-- ---------------------------------------------------------------------------
-- visitor_sessions (upsert por sck => UNIQUE(sck) obrigatorio)
-- ---------------------------------------------------------------------------
create table if not exists gta.visitor_sessions (
  id                    uuid        primary key default gen_random_uuid(),
  sck                   text        not null,
  fbp                   text,
  fbc                   text,
  ip_address            text,
  user_agent            text,
  page_location         text,
  city                  text,
  state                 text,
  country               text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now(),
  event_id_pageview     text,
  event_id_initiate     text,
  email                 text,
  phone                 text,
  first_name            text,
  last_name             text,
  external_id           text,
  fbclid                text,
  ttclid                text,
  ttp                   text,
  event_id_pageview_tt  text,
  event_id_initiate_tt  text,
  event_id_purchase_tt  text,
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_content           text,
  utm_term              text,
  pixel_id              text,
  constraint visitor_sessions_sck_key unique (sck)
);

drop trigger if exists update_visitor_sessions_updated_at on gta.visitor_sessions;
create trigger update_visitor_sessions_updated_at
  before update on gta.visitor_sessions
  for each row execute function gta.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- meta_capi_log
-- ---------------------------------------------------------------------------
create table if not exists gta.meta_capi_log (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  event_name    text        not null,
  event_id      text,
  order_id      uuid,
  session_id    text,
  value         numeric,
  status_code   integer,
  success       boolean     not null default false,
  meta_response jsonb,
  error         text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text,
  page_source   text,
  pixel_id      text,
  pixel_label   text
);
create index if not exists idx_meta_capi_log_event_name    on gta.meta_capi_log (event_name);
create index if not exists idx_meta_capi_log_order_id      on gta.meta_capi_log (order_id);
create index if not exists idx_meta_capi_log_created_at    on gta.meta_capi_log (created_at desc);
create index if not exists idx_meta_capi_log_event_id      on gta.meta_capi_log (event_id);
create index if not exists idx_meta_capi_log_utm_campaign  on gta.meta_capi_log (utm_campaign);
create index if not exists meta_capi_log_page_source_idx   on gta.meta_capi_log (page_source);

-- ---------------------------------------------------------------------------
-- integrations (webhooks de compra de saida) -- SEGREDOS, so service_role
-- integration_deliveries: log + idempotencia (1 tentativa por venda/integracao/evento)
-- ---------------------------------------------------------------------------
create table if not exists gta.integrations (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  target_url text        not null,
  secret     text,
  api_key    text,
  events     text[]      not null default '{}',
  product    text,
  active     boolean     not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);
create index if not exists idx_integrations_active on gta.integrations (active);

create table if not exists gta.integration_deliveries (
  id              uuid        primary key default gen_random_uuid(),
  integration_id  uuid        not null references gta.integrations(id) on delete cascade,
  order_id        uuid,
  event           text        not null,
  request_body    jsonb,
  response_status integer,
  response_body   jsonb,
  magic_link      text,
  error           text,
  created_at      timestamptz not null default now(),
  unique (integration_id, order_id, event)
);
create index if not exists idx_integration_deliveries_created     on gta.integration_deliveries (created_at desc);
create index if not exists idx_integration_deliveries_integration on gta.integration_deliveries (integration_id);
create index if not exists idx_integration_deliveries_order       on gta.integration_deliveries (order_id);

-- ---------------------------------------------------------------------------
-- member_access (fica vazia; so existe porque o hook useAuth consulta)
-- ---------------------------------------------------------------------------
create table if not exists gta.member_access (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product    text        not null default 'infozap',
  order_id   uuid        references gta.orders(id),
  active     boolean     not null default true,
  granted_at timestamptz not null default now(),
  area_id    uuid,
  unique (user_id, product)
);

-- ---------------------------------------------------------------------------
-- member_areas (vazia; consultada por useResolvedArea / pages/master/MemberAreas)
-- ---------------------------------------------------------------------------
create table if not exists gta.member_areas (
  id         uuid        primary key default gen_random_uuid(),
  slug       text        not null,
  name       text        not null,
  product    text        not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id   uuid        not null
);
create unique index if not exists member_areas_owner_name_unique on gta.member_areas (owner_id, lower(name));

drop trigger if exists trg_member_areas_updated_at on gta.member_areas;
create trigger trg_member_areas_updated_at
  before update on gta.member_areas
  for each row execute function gta.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- site_settings (singleton id=1; leitura publica)
-- ---------------------------------------------------------------------------
create table if not exists gta.site_settings (
  id                      integer     primary key default 1,
  logo_url                text,
  primary_color           text,
  secondary_color         text,
  hero_title              text,
  hero_description        text,
  hero_media_url          text,
  hero_media_type         text,
  updated_at              timestamptz not null default now(),
  updated_by              uuid,
  footer_gradient_enabled boolean     not null default true,
  footer_gradient_color   text,
  category_color_enabled  boolean     not null default true,
  category_color          text,
  hero_title_html         text,
  hero_description_html   text,
  constraint site_settings_singleton check (id = 1),
  constraint site_settings_hero_media_type_check check (hero_media_type in ('image', 'video'))
);
insert into gta.site_settings (id, footer_gradient_color, category_color)
  values (1, '#a855f7', '#a855f7')
  on conflict (id) do nothing;

-- =============================================================================
-- RLS (habilitado em todas) + policies
-- =============================================================================
alter table gta.orders                enable row level security;
alter table gta.payment_settings      enable row level security;
alter table gta.tracking_pixels       enable row level security;
alter table gta.visitor_sessions      enable row level security;
alter table gta.meta_capi_log         enable row level security;
alter table gta.integrations          enable row level security;
alter table gta.integration_deliveries enable row level security;
alter table gta.user_roles            enable row level security;
alter table gta.member_access         enable row level security;
alter table gta.member_areas          enable row level security;
alter table gta.site_settings         enable row level security;

-- payment_settings, integrations, visitor_sessions: SEM policy de proposito.
-- Acesso so via service_role (bypassa RLS) nas edge functions.

-- orders
drop policy if exists "Admins view orders" on gta.orders;
create policy "Admins view orders" on gta.orders
  for select using (gta.has_role(auth.uid(), 'admin'::gta.app_role));

-- tracking_pixels
drop policy if exists "Admins manage tracking pixels" on gta.tracking_pixels;
create policy "Admins manage tracking pixels" on gta.tracking_pixels
  for all using (gta.has_role(auth.uid(), 'admin'::gta.app_role))
  with check (gta.has_role(auth.uid(), 'admin'::gta.app_role));

-- meta_capi_log
drop policy if exists "Service role manages capi log" on gta.meta_capi_log;
create policy "Service role manages capi log" on gta.meta_capi_log
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Admins view capi log" on gta.meta_capi_log;
create policy "Admins view capi log" on gta.meta_capi_log
  for select using (gta.has_role(auth.uid(), 'admin'::gta.app_role));

-- integration_deliveries
drop policy if exists "Admins read integration deliveries" on gta.integration_deliveries;
create policy "Admins read integration deliveries" on gta.integration_deliveries
  for select using (gta.has_role(auth.uid(), 'admin'::gta.app_role));

drop policy if exists "Service role insert integration deliveries" on gta.integration_deliveries;
create policy "Service role insert integration deliveries" on gta.integration_deliveries
  for insert with check (auth.role() = 'service_role');

drop policy if exists "Service role update integration deliveries" on gta.integration_deliveries;
create policy "Service role update integration deliveries" on gta.integration_deliveries
  for update using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- user_roles (somente leitura; escrita so via service_role/edge function)
drop policy if exists "Users can view own roles" on gta.user_roles;
create policy "Users can view own roles" on gta.user_roles
  for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all roles" on gta.user_roles;
create policy "Admins can view all roles" on gta.user_roles
  for select using (gta.has_role(auth.uid(), 'admin'::gta.app_role));

-- member_access
drop policy if exists "Users view own access" on gta.member_access;
create policy "Users view own access" on gta.member_access
  for select using (auth.uid() = user_id);

drop policy if exists "Admins view all access" on gta.member_access;
create policy "Admins view all access" on gta.member_access
  for select using (gta.has_role(auth.uid(), 'admin'::gta.app_role));

-- (escrita real e feita por edge function/service_role; a policy so tem efeito se alguem conceder DML)
drop policy if exists "Admins manage access" on gta.member_access;
create policy "Admins manage access" on gta.member_access
  for all using (gta.has_role(auth.uid(), 'admin'::gta.app_role))
  with check (gta.has_role(auth.uid(), 'admin'::gta.app_role));

-- member_areas (estado pos-auditoria M3)
drop policy if exists "View own areas or super admin" on gta.member_areas;
create policy "View own areas or super admin" on gta.member_areas
  for select to authenticated
  using (
    owner_id = auth.uid()
    or gta.is_super_admin(auth.uid())
    or exists (
      select 1 from gta.member_access ma
      where ma.user_id = auth.uid() and ma.product = member_areas.product and ma.active
    )
  );

drop policy if exists "Insert own area" on gta.member_areas;
create policy "Insert own area" on gta.member_areas
  for insert to authenticated
  with check (
    (gta.has_role(auth.uid(), 'master'::gta.app_role) and owner_id = auth.uid())
    or gta.is_super_admin(auth.uid())
  );

drop policy if exists "Update own area" on gta.member_areas;
create policy "Update own area" on gta.member_areas
  for update to authenticated
  using (owner_id = auth.uid() or gta.is_super_admin(auth.uid()))
  with check (owner_id = auth.uid() or gta.is_super_admin(auth.uid()));

drop policy if exists "Delete own area" on gta.member_areas;
create policy "Delete own area" on gta.member_areas
  for delete to authenticated
  using (owner_id = auth.uid() or gta.is_super_admin(auth.uid()));

-- site_settings
drop policy if exists "Anyone can read site settings" on gta.site_settings;
create policy "Anyone can read site settings" on gta.site_settings
  for select using (true);

drop policy if exists "Admins manage site settings" on gta.site_settings;
create policy "Admins manage site settings" on gta.site_settings
  for all using (gta.has_role(auth.uid(), 'admin'::gta.app_role))
  with check (gta.has_role(auth.uid(), 'admin'::gta.app_role));

-- =============================================================================
-- GRANTS (PostgREST). RLS continua mandando; aqui so o minimo por papel.
-- =============================================================================
grant usage on schema gta to anon, authenticated, service_role;

-- zera o que possa ter vindo por default privileges e concede so o necessario
revoke all on all tables in schema gta from anon, authenticated;

grant all on all tables in schema gta to service_role;
alter default privileges in schema gta grant all on tables to service_role;

-- anon: so leitura publica das configuracoes do site (tracking publico vai pela RPC)
grant select on gta.site_settings to anon;

-- authenticated: o que o frontend acessa direto (sempre filtrado por RLS)
grant select                         on gta.orders                 to authenticated;
grant select, insert, update, delete on gta.tracking_pixels        to authenticated;
grant select                         on gta.meta_capi_log          to authenticated;
grant select                         on gta.integration_deliveries to authenticated;
grant select                         on gta.user_roles             to authenticated;
grant select                         on gta.member_access          to authenticated;
grant select, insert, update, delete on gta.member_areas           to authenticated;
grant select, update                 on gta.site_settings          to authenticated;
-- payment_settings, integrations, visitor_sessions: nenhum grant para anon/authenticated.

-- funcoes: has_role/is_super_admin sao avaliadas dentro das policies (precisam de EXECUTE
-- para anon e authenticated); a RPC de pixels e publica.
revoke all on function gta.has_role(uuid, gta.app_role)    from public;
revoke all on function gta.is_super_admin(uuid)            from public;
revoke all on function gta.get_active_tracking_pixels()    from public;
revoke all on function gta.update_updated_at_column()      from public;

grant execute on function gta.has_role(uuid, gta.app_role)  to anon, authenticated, service_role;
grant execute on function gta.is_super_admin(uuid)          to anon, authenticated, service_role;
grant execute on function gta.get_active_tracking_pixels()  to anon, authenticated, service_role;
grant execute on function gta.update_updated_at_column()    to service_role;

commit;

notify pgrst, 'reload schema';
