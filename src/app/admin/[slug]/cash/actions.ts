"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";

async function authorize(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const restaurant = await getRestaurant(slug);
  if (!restaurant) throw new Error("Restaurante no encontrado");
  const superAdmin = await isSuperAdmin(user.id);
  if (!superAdmin) {
    const { data: membership, error } = await supabase.from("restaurant_users").select("restaurant_id, role").eq("user_id", user.id).eq("restaurant_id", restaurant.id).in("role", ["owner", "staff"]).maybeSingle();
    if (error) throw error;
    if (!membership) throw new Error("Restaurante no autorizado");
  }
  return restaurant;
}

export async function openCashRegister(slug: string, openingCash: number) {
  const restaurant = await authorize(slug);
  if (!Number.isFinite(openingCash) || openingCash < 0) throw new Error("El efectivo inicial no es válido");
  const { data: existing } = await supabaseAdmin.from("cash_registers").select("id").eq("restaurant_id", restaurant.id).is("closed_at", null).maybeSingle();
  if (existing) throw new Error("Ya hay una caja abierta para este restaurante");
  const { error } = await supabaseAdmin.from("cash_registers").insert({ restaurant_id: restaurant.id, opening_cash: openingCash });
  if (error) throw error;
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/admin/${slug}/cash`);
}

export async function closeCashRegister(slug: string, countedCash: number) {
  const restaurant = await authorize(slug);
  if (!Number.isFinite(countedCash) || countedCash < 0) throw new Error("El efectivo contado no es válido");
  const { data: cash, error: cashError } = await supabaseAdmin.from("cash_registers").select("id, opening_cash, opened_at").eq("restaurant_id", restaurant.id).is("closed_at", null).maybeSingle();
  if (cashError) throw cashError;
  if (!cash) throw new Error("No hay una caja abierta");

  const { data: payments, error: paymentsError } = await supabaseAdmin.from("payments").select("amount, payment_method").eq("cash_register_id", cash.id);
  if (paymentsError) throw paymentsError;
  const totalCash = (payments ?? []).filter((p) => p.payment_method === "cash").reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const totalCard = (payments ?? []).filter((p) => p.payment_method === "card").reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const totalSales = totalCash + totalCard;
  const expectedCash = Number(cash.opening_cash) + totalCash;
  const difference = countedCash - expectedCash;

  const { error: closeError } = await supabaseAdmin.from("cash_registers").update({ closed_at: new Date().toISOString(), expected_cash: expectedCash, counted_cash: countedCash, cash_difference: difference, total_cash: totalCash, total_card: totalCard, total_sales: totalSales, payment_count: payments?.length ?? 0 }).eq("id", cash.id).is("closed_at", null);
  if (closeError) throw closeError;

  const { error: sessionsError } = await supabaseAdmin.from("table_sessions").update({ status: "closed", closed_at: new Date().toISOString() }).eq("restaurant_id", restaurant.id).eq("status", "open");
  if (sessionsError) throw sessionsError;

  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/admin/${slug}/cash`);
  revalidatePath(`/admin/${slug}/orders`);
  revalidatePath(`/admin/${slug}/tables`);
}
