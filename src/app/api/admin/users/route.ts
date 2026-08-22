import { NextResponse } from "next/server";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";

async function authorize(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { response: NextResponse.json({ error: "No autenticado." }, { status: 401 }) };

  const restaurant = await getRestaurant(slug);
  if (!restaurant) return { response: NextResponse.json({ error: "Restaurante no encontrado." }, { status: 404 }) };

  if (await isSuperAdmin(user.id)) return { user, restaurant };

  const { data: membership, error } = await supabase
    .from("restaurant_users")
    .select("role")
    .eq("user_id", user.id)
    .eq("restaurant_id", restaurant.id)
    .eq("role", "owner")
    .maybeSingle();

  if (error || !membership) return { response: NextResponse.json({ error: "No tienes permisos para gestionar usuarios." }, { status: 403 }) };
  return { user, restaurant };
}

function normalizeRole(role: unknown) {
  return role === "admin" ? "owner" : "staff";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const role = normalizeRole(body?.role);

    const auth = await authorize(slug);
    if (auth.response) return auth.response;
    if (!name || !email || password.length < 8) return NextResponse.json({ error: "Nombre, email y una contraseña de al menos 8 caracteres son obligatorios." }, { status: 400 });

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });
    if (createError || !created.user) return NextResponse.json({ error: createError?.message || "No se ha podido crear el usuario." }, { status: 400 });

    const { error: membershipError } = await supabaseAdmin.from("restaurant_users").insert({
      user_id: created.user.id,
      restaurant_id: auth.restaurant.id,
      role,
    });

    if (membershipError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return NextResponse.json({ error: membershipError.message }, { status: 400 });
    }

    return NextResponse.json({
      user: { id: `${created.user.id}-${auth.restaurant.id}`, userId: created.user.id, email, name, role: role === "owner" ? "admin" : "waiter", createdAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Create restaurant user error", error);
    return NextResponse.json({ error: "No se ha podido crear el usuario." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const userId = typeof body?.userId === "string" ? body.userId : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const role = normalizeRole(body?.role);

    const auth = await authorize(slug);
    if (auth.response) return auth.response;
    if (!userId || !name) return NextResponse.json({ error: "Datos de usuario incompletos." }, { status: 400 });

    const update: { user_metadata: { full_name: string }; password?: string } = { user_metadata: { full_name: name } };
    if (password && password.length < 8) return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    if (password) update.password = password;

    const { data: updated, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, update);
    if (updateError || !updated.user) return NextResponse.json({ error: updateError?.message || "No se ha podido actualizar el usuario." }, { status: 400 });

    const { error: membershipError } = await supabaseAdmin
      .from("restaurant_users")
      .update({ role })
      .eq("user_id", userId)
      .eq("restaurant_id", auth.restaurant.id);
    if (membershipError) return NextResponse.json({ error: membershipError.message }, { status: 400 });

    return NextResponse.json({
      user: { id: `${userId}-${auth.restaurant.id}`, userId, email: updated.user.email ?? "", name, role: role === "owner" ? "admin" : "waiter", createdAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Update restaurant user error", error);
    return NextResponse.json({ error: "No se ha podido actualizar el usuario." }, { status: 500 });
  }
}
