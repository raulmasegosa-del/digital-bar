import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";
import UsersManager from "@/components/admin/UsersManager";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export default async function RestaurantUsersPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();

  const superAdmin = await isSuperAdmin(user.id);
  if (!superAdmin) {
    const { data: membership, error } = await supabase
      .from("restaurant_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("restaurant_id", restaurant.id)
      .in("role", ["owner", "staff"])
      .maybeSingle();
    if (error || !membership || membership.role !== "owner") notFound();
  }

  const { data: memberships, error: membershipsError } = await supabaseAdmin
    .from("restaurant_users")
    .select("id, user_id, role, created_at")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: true });

  if (membershipsError) throw membershipsError;

  const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (authError) throw authError;

  const authById = new Map(authUsers.users.map((item) => [item.id, item]));
  const users = (memberships ?? []).map((membership) => {
    const authUser = authById.get(membership.user_id);
    return {
      id: membership.id,
      userId: membership.user_id,
      email: authUser?.email ?? "",
      name: String(authUser?.user_metadata?.full_name ?? authUser?.user_metadata?.name ?? "").trim(),
      role: membership.role === "owner" ? "admin" : "waiter",
      createdAt: membership.created_at,
    };
  });

  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">Administración</p>
            <h1 className="mt-1 text-3xl font-semibold">Usuarios</h1>
            <p className="mt-2 text-sm text-zinc-400">Gestiona quién puede entrar en {restaurant.name} y con qué rol.</p>
          </div>
        </div>

        <UsersManager slug={slug} initialUsers={users} />
      </div>
    </main>
  );
}
