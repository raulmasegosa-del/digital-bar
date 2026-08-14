-- DIGITAL BAR / VERI*FACTU
-- AEAT-oriented metadata layer. Test-first: no AEAT submission is enabled here.
-- Existing fiscal records are NOT rewritten; new fields are nullable for backwards compatibility.

alter table fiscal_invoices
  add column if not exists operation_date date,
  add column if not exists operation_description text,
  add column if not exists tax_regime text,
  add column if not exists reverse_charge boolean not null default false,
  add column if not exists rectifying boolean not null default false,
  add column if not exists rectified_invoice_numbers jsonb not null default '[]'::jsonb,
  add column if not exists simplified_substitution boolean not null default false,
  add column if not exists substituted_invoice_numbers jsonb not null default '[]'::jsonb,
  add column if not exists non_subject_amount numeric(12,2),
  add column if not exists non_subject_cause text,
  add column if not exists aeat_payload jsonb;

alter table fiscal_records
  add column if not exists record_version text,
  add column if not exists operation_date date,
  add column if not exists operation_description text,
  add column if not exists tax_regime text,
  add column if not exists reverse_charge boolean not null default false,
  add column if not exists rectifying boolean not null default false,
  add column if not exists rectified_invoice_numbers jsonb not null default '[]'::jsonb,
  add column if not exists substituted_invoice_numbers jsonb not null default '[]'::jsonb,
  add column if not exists non_subject_amount numeric(12,2),
  add column if not exists non_subject_cause text,
  add column if not exists sif_identifier text,
  add column if not exists sif_producer_name text,
  add column if not exists sif_producer_tax_id text,
  add column if not exists sif_name text,
  add column if not exists sif_version text,
  add column if not exists sif_installation_id text,
  add column if not exists sif_only_verifactu boolean,
  add column if not exists generated_at_local text,
  add column if not exists previous_chain_record_type text,
  add column if not exists hash_input jsonb,
  add column if not exists aeat_payload jsonb,
  add column if not exists qr_payload text;

create index if not exists fiscal_records_sif_chain_idx
  on fiscal_records (restaurant_id, environment, generated_at, id);
