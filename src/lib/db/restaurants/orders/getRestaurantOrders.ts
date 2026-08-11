import { supabaseAdmin } from "@/lib/supabase/server";
import type { Order, OrderOption } from "@/types/orders";

type RawOrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  options: unknown;
};

type RawOrder = {
  id: string;
  restaurant_id: string;
  table_number: string;
  status: Order["status"];
  notes: string | null;
  total: number | string | null;
  created_at: string;
  order_items: RawOrderItem[] | null;
};

function normalizeOptions(value: unknown): OrderOption[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (option): option is OrderOption =>
      typeof option === "object" &&
      option !== null &&
      typeof (option as OrderOption).groupId === "string" &&
      typeof (option as OrderOption).groupName === "string" &&
      typeof (option as OrderOption).optionId === "string" &&
      typeof (option as OrderOption).optionName === "string" &&
      typeof (option as OrderOption).extraPrice === "number"
  );
}

export async function getRestaurantOrders(
  restaurantId: string
): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      restaurant_id,
      table_number,
      status,
      notes,
      total,
      created_at,
      order_items (
        id,
        order_id,
        product_id,
        name,
        quantity,
        price,
        options
      )
    `)
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as RawOrder[]).map((order) => ({
    id: order.id,
    table: order.table_number,
    table_number: order.table_number,
    status: order.status,
    notes: order.notes ?? "",
    total: Number(order.total ?? 0),
    created_at: order.created_at,
    order_items: (order.order_items ?? []).map((item) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      name: item.name,
      quantity: Number(item.quantity ?? 0),
      price: Number(item.price ?? 0),
      options: normalizeOptions(item.options),
    })),
  }));
}
