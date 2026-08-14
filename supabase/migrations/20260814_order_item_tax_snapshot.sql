-- DIGITAL BAR / fiscal tax snapshot
-- Freeze the VAT rate used by each sold line at the moment the order item is created.

alter table if exists order_items
  add column if not exists tax_rate numeric(5,2);

alter table if exists order_items
  add column if not exists tax_amount numeric(12,2);

alter table if exists order_items
  drop constraint if exists order_items_tax_rate_check;

alter table if exists order_items
  add constraint order_items_tax_rate_check
  check (tax_rate is null or (tax_rate >= 0 and tax_rate <= 100));
