import { NextResponse } from "next/server";
import { createHash } from "crypto";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { supabaseAdmin } from "@/lib/supabase/server";

function hashPin(pin: string) {
  return createHash("sha256").update(pin).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const pin = typeof body?.pin === "string" ? body.pin.trim() : "";

    if (!slug || !/^\d{4,8}$/.test(pin)) {
      return NextResponse.json({ error: "Credenciales no válidas." }, { status: 400 });
    }

    const restaurant = await getRestaurant(slug);
    if (!restaurant) {
      return NextResponse.json({ error: "Credenciales no válidas." }, { status: 401 });
    }

    const { data: settings, error } = await supabaseAdmin
      .from("restaurant_settings")
      .select("waiter_pin_hash")
      .eq("restaurant_id", restaurant.id)
      .maybeSingle();

    if (error) throw error;

    if (!settings?.waiter_pin_hash || settings.waiter_pin_hash !== hashPin(pin)) {
      return NextResponse.json({ error: "Credenciales no válidas." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("digital_bar_waiter", `${restaurant.id}:${hashPin(pin)}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: `/waiter/${slug}`,
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error("Waiter login error", error);
    return NextResponse.json({ error: "No se ha podido iniciar sesión." }, { status: 500 });
  }
}
