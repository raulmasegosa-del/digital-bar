"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function createCustomerSession({ slug, table }: { slug: string; table: string }) {
  const tableNumber = table.trim();
  const restaurantSlug = slug.trim();

  if (!restaurantSlug || !tableNumber) {
    throw new Error("No se ha podido identificar el restaurante o la mesa. Escanea de nuevo el QR.");
  }

  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", restaurantSlug)
    .maybeSingle();
  if (restaurantError) throw restaurantError;
  if (!restaurant) throw new Error("Restaurante no encontrado.");

  const { data: tableRow, error: tableError } = await supabaseAdmin
    .from("tables")
    .select("id, number, active")
    .eq("restaurant_id", restaurant.id)
    .eq("number", Number(tableNumber))
    .maybeSingle();
  if (tableError) throw tableError;
  if (!tableRow) throw new Error("La mesa indicada no existe en este restaurante.");
  if (!tableRow.active) throw new Error("Esta mesa no está disponible.");

  // Si ya hay una sesión abierta, pertenece al grupo que está usando la mesa.
  // Reutilizamos su token para permitir que varios móviles del mismo grupo pidan.
  const { data: existingSession, error: existingError } = await supabaseAdmin
    .from("table_sessions")
    .select("id, access_token, status")
    .eq("restaurant_id", restaurant.id)
    .eq("table_number", tableNumber)
    .eq("status", "open")
    .maybeSingle();
  if (existingError) throw existingError;

  if (existingSession?.access_token) {
    return {
      restaurantId: restaurant.id,
      table: tableNumber,
      sessionId: existingSession.id,
      token: existingSession.access_token,
    };
  }

  const { data: session, error: createError } = await supabaseAdmin
    .from("table_sessions")
    .insert({
      restaurant_id: restaurant.id,
      table_number: tableNumber,
      status: "open",
    })
    .select("id, access_token, status")
    .single();

  if (createError) throw createError;
  if (!session?.access_token) throw new Error("No se ha podido crear la sesión de la mesa.");

  return {
    restaurantId: restaurant.id,
    table: tableNumber,
    sessionId: session.id,
    token: session.access_token,
  };
}
