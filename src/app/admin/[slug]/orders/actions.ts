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
  status: OrderStatus
) {
  if (!allowedStatuses.includes(status)) {
    throw new Error("Estado de pedido no válido");
  }

  // Keep authentication/authorization on the user's server session.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  // The permission check above is performed with the user's session.
  // Use the server-side service client for the actual write so an RLS policy
  // cannot silently turn the update into a zero-row update for an authorized
  // admin.
  const { data: updatedOrder, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("restaurant_id", restaurant.id)
    .select("id, status")
    .maybeSingle();

  if (error) throw error;
  if (!updatedOrder) {
    throw new Error("No se encontró el pedido para actualizar");
  }

  revalidatePath(`/admin/${slug}/orders`, "page");
  revalidatePath(`/admin/${slug}/tables`, "page");
  revalidatePath(`/admin/${slug}`, "page");

  return { id: updatedOrder.id, status: updatedOrder.status as OrderStatus };
}
