import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminEntryPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No hay sesión
  if (!user) {
    redirect("/login");
  }

  // Buscar el restaurante asociado al usuario
  const { data: membership, error } = await supabase
    .from("restaurant_users")
    .select(
      `
        restaurant_id,
        role,
        restaurants (
          slug
        )
      `
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  // Usuario autenticado pero sin restaurante asignado
  if (!membership?.restaurants) {
    redirect("/login");
  }

  const restaurant = Array.isArray(
    membership.restaurants
  )
    ? membership.restaurants[0]
    : membership.restaurants;

  if (!restaurant?.slug) {
    redirect("/login");
  }

  redirect(`/admin/${restaurant.slug}`);
}