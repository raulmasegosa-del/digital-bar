"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";
import type { OrderStatus } from "@/types/orders";

const allowedStatuses: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "served",
  "bill",
  "completed",
  "cancelled",
];

export async function updateRestaurantOrderStatus(
  slug: string,
  orderId: string,
  status: OrderStatus,
  orderIds: string[] = []
) {
  if (!allowedStatuses.includes(status)) throw new Error("Estado de pedido no válido");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const restaurant = await getRestaurant(slug);
  if (!restaurant) throw new Error("Restaurante no encontrado");

  const superAdmin = await isSuperAdmin(user.id);
  if (!superAdmin) {
    const { data: membership, error: membershipError } = await supabase
      .from("restaurant_users")
      .select("restaurant_id, role")
      .eq("user_id", user.id)
      .eq("restaurant_id", restaurant.id)
      .in("role", ["owner", "staff"])
      .maybeSingle();
    if (membershipError) throw membershipError;
    if (!membership) throw new Error("Restaurante no autorizado");
  }

  const ids = Array.from(new Set([orderId, ...orderIds].filter(Boolean)));
  const { data: updatedOrders, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .in("id", ids)
    .eq("restaurant_id", restaurant.id)
    .select("id, status");

  if (error) throw error;
  if (!updatedOrders?.length) throw new Error("No se encontraron los pedidos para actualizar");

  revalidatePath(`/admin/${slug}/orders`, "page");
  revalidatePath(`/admin/${slug}/tables`, "page");
  revalidatePath(`/admin/${slug}`, "page");

  return { id: orderId, status: updatedOrders[0].status as OrderStatus, updatedCount: updatedOrders.length };
}
