-- DIGITAL BAR / order-session integrity guard
-- Ensures every new order is attached to an open table session.
-- If the caller does not provide session_id, reuse the current open session
-- for the restaurant/table or create one for the new order.

create or replace function public.ensure_order_table_session()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_session uuid;
begin
  if new.session_id is not null then
    return new;
  end if;

  select id
    into existing_session
  from public.table_sessions
  where restaurant_id = new.restaurant_id
    and table_number = new.table_number
    and status = 'open'
  order by opened_at desc
  limit 1;

  if existing_session is null then
    insert into public.table_sessions (restaurant_id, table_number, status)
    values (new.restaurant_id, new.table_number, 'open')
    returning id into existing_session;
  end if;

  new.session_id := existing_session;
  return new;
end;
$$;

drop trigger if exists trg_orders_ensure_table_session on public.orders;

create trigger trg_orders_ensure_table_session
before insert on public.orders
for each row
execute function public.ensure_order_table_session();
