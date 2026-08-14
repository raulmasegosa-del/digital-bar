-- DIGITAL BAR / VERI*FACTU foundation
-- Test-first migration: creates the fiscal core without enabling AEAT submissions.
-- Apply only after reviewing the existing Supabase schema.

create table if not exists fiscal_invoices (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null,
  order_id uuid,
  series text not null,
  number integer not null check (number > 0),
  invoice_number text not null,
  invoice_type text not null check (invoice_type in ('F1', 'F2')),
  issued_at timestamptz not null,
  issuer_name text not null,
  issuer_nif text not null,
  issuer_address text not null,
  items jsonb not null default '[]'::jsonb,
  tax_breakdown jsonb not null default '[]'::jsonb,
  total_tax numeric(12,2) not null check (total_tax >= 0),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  status text not null default 'issued' check (status in ('issued', 'annulled')),
  created_at timestamptz not null default now(),
  unique (restaurant_id, series, number),
  unique (restaurant_id, invoice_number)
);

create table if not exists fiscal_records (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null,
  invoice_id uuid not null references fiscal_invoices(id),
  record_type text not null check (record_type in ('alta', 'anulacion')),
  issuer_nif text not null,
  invoice_number text not null,
  issued_at timestamptz not null,
  invoice_type text,
  total_tax numeric(12,2),
  total_amount numeric(12,2),
  previous_issuer_nif text,
  previous_invoice_number text,
  previous_issued_at timestamptz,
  previous_hash text,
  generated_at timestamptz not null,
  hash_algorithm text not null default '01',
  hash text not null check (length(hash) = 64),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'accepted_with_errors', 'rejected')),
  environment text not null default 'test' check (environment in ('test', 'production')),
  created_at timestamptz not null default now(),
  unique (restaurant_id, id),
  unique (restaurant_id, hash)
);

create index if not exists fiscal_records_chain_idx
  on fiscal_records (restaurant_id, generated_at, created_at, id);

-- Fiscal records are append-only. Corrections must create another record.
create or replace function prevent_fiscal_record_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Fiscal records are immutable; create a new record instead.';
end;
$$;

drop trigger if exists fiscal_records_immutable on fiscal_records;
create trigger fiscal_records_immutable
before update or delete on fiscal_records
for each row execute function prevent_fiscal_record_mutation();
