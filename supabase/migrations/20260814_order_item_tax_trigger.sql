-- DIGITAL BAR / fiscal safety net
-- Guarantee that every newly inserted order line gets its VAT snapshot
-- directly in PostgreSQL, regardless of which application flow creates it.

create or replace function public.set_order_item_tax_snapshot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  configured_rate numeric(5,2);
  line_total numeric(12,2);
begin
  select tax_rate
    into configured_rate
  from public.menu_items
  where id = new.product_id;

  configured_rate := coalesce(configured_rate, 10.00);
  line_total := round(coalesce(new.price, 0)::numeric * coalesce(new.quantity, 0)::numeric, 2);

  new.tax_rate := configured_rate;
  new.tax_amount := case
    when configured_rate <= 0 then 0
    else round((line_total * configured_rate) / (100 + configured_rate), 2)
  end;

  return new;
end;
$$;

drop trigger if exists trg_order_items_tax_snapshot on public.order_items;

create trigger trg_order_items_tax_snapshot
before insert on public.order_items
for each row
execute function public.set_order_item_tax_snapshot();
