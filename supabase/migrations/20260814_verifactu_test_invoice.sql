-- DIGITAL BAR / VERI*FACTU test invoice generation foundation
-- Fictional test issuer only. No AEAT submission is performed by this migration.
-- Intended to generate the first controlled F2 test invoice from an already-paid order.

alter table if exists restaurant_settings
  add column if not exists fiscal_name text,
  add column if not exists fiscal_nif text,
  add column if not exists fiscal_address text,
  add column if not exists fiscal_postal_code text,
  add column if not exists fiscal_city text;

-- Explicit test identity for the configured fictional restaurant.
update restaurant_settings
set fiscal_name = 'DIGITAL BAR PRUEBAS, S.L.',
    fiscal_nif = 'B12345678',
    fiscal_address = 'Calle de la Prueba, 10',
    fiscal_postal_code = '28001',
    fiscal_city = 'Madrid'
where restaurant_id = '112104d6-d043-482b-bf2b-5121c4fb9749';

-- Series metadata is deliberately kept separate from production AEAT configuration.
create table if not exists fiscal_series (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null,
  series text not null,
  next_number integer not null default 1 check (next_number > 0),
  environment text not null default 'test' check (environment in ('test','production')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, series, environment)
);

insert into fiscal_series (restaurant_id, series, next_number, environment)
values ('112104d6-d043-482b-bf2b-5121c4fb9749', 'T', 1, 'test')
on conflict (restaurant_id, series, environment) do nothing;
