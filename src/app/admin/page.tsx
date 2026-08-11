import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export default async function AdminEntryPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }
  

  if (!user) {
    redirect("/login");
  }
console.log("AUTH USER:", {
  id: user.id,
  email: user.email,
});
  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from("restaurant_users")
    .select("restaurant_id, role")
    .eq("user_id", user.id)
    .eq("role", "owner")
    .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  if (!membership) {
    throw new Error(
      "El usuario está autenticado pero no tiene ningún restaurante asignado."
    );
  }

  const {
    data: restaurant,
    error: restaurantError,
  } = await supabaseAdmin
    .from("restaurants")
    .select("id, slug")
    .eq("id", membership.restaurant_id)
    .maybeSingle();

  if (restaurantError) {
    throw restaurantError;
  }

  if (!restaurant) {
    throw new Error(
      "El restaurante asociado al usuario no existe."
    );
  }

  redirect(`/admin/${restaurant.slug}`);
}