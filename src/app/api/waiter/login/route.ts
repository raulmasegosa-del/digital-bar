import { NextResponse } from "next/server";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!slug || !email || !password) {
      return NextResponse.json({ error: "Introduce usuario y contraseña." }, { status: 400 });
    }

    const restaurant = await getRestaurant(slug);
    if (!restaurant) return NextResponse.json({ error: "Credenciales no válidas." }, { status: 401 });

    const supabase = await createSupabaseServerClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No se ha podido validar la sesión." }, { status: 401 });

    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("restaurant_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("restaurant_id", restaurant.id)
      .in("role", ["owner", "staff"])
      .maybeSingle();

    if (membershipError) throw membershipError;
    if (!membership) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Este usuario no tiene acceso a este restaurante." }, { status: 403 });
    }

    return NextResponse.json({ ok: true, role: membership.role });
  } catch (error) {
    console.error("Waiter login error", error);
    return NextResponse.json({ error: "No se ha podido iniciar sesión." }, { status: 500 });
  }
}
