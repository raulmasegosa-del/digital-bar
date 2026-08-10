import { notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminDashboardPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();

  // Comprobar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Comprobar que el usuario tiene acceso a este restaurante
  const { data: membership, error: membershipError } =
    await supabase
      .from("restaurant_users")
      .select("restaurant_id, role")
      .eq("user_id", user.id)
      .eq("role", "owner")
      .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  // El usuario no tiene ningún restaurante autorizado
  if (!membership) {
    notFound();
  }

  // Obtener el restaurante solicitado
  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  // El restaurante de la URL no es el restaurante
  // que pertenece al usuario autenticado
  if (restaurant.id !== membership.restaurant_id) {
    notFound();
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            🍔 Productos
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Gestiona la carta del restaurante.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            📋 Pedidos
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Consulta los pedidos en tiempo real.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            🪑 Mesas
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Gestiona las mesas del restaurante.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            ⚙️ Configuración
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Personaliza tu restaurante.
          </p>
        </div>
      </div>
    </>
  );
}