-- DIGITAL BAR / fiscal tax configuration
-- Test-first: add explicit VAT rate to menu items.
-- Existing products default to 10% for the test restaurant.

alter table if exists menu_items
  add column if not exists tax_rate numeric(5,2) not null default 10.00;

alter table if exists menu_items
  drop constraint if exists menu_items_tax_rate_check;

alter table if exists menu_items
  add constraint menu_items_tax_rate_check
  check (tax_rate >= 0 and tax_rate <= 100);

-- Existing products in the test environment use 10% VAT by default.
update menu_items
set tax_rate = 10.00
where tax_rate is null or tax_rate = 10.00;

-- Example mixed-rate test product: vodka is deliberately 21%.
update menu_items
set tax_rate = 21.00
where id = 'vodka-absolut';
