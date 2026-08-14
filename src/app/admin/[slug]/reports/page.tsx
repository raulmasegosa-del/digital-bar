import { notFound } from "next/navigation";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";
import ReportsClient from "@/components/admin/ReportsClient";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export default async function ReportsPage({ params }: Props) {
  const { slug } = await params; const supabase = await createSupabaseServerClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) notFound(); const restaurant = await getRestaurant(slug); if (!restaurant) notFound();
  const superAdmin = await isSuperAdmin(user.id);
  if (!superAdmin) { const { data: membership } = await supabase.from("restaurant_users").select("restaurant_id").eq("user_id", user.id).eq("restaurant_id", restaurant.id).in("role", ["owner", "staff"]).maybeSingle(); if (!membership) notFound(); }
  const { data: registers } = await supabaseAdmin.from("cash_registers").select("id, opened_at, closed_at, opening_cash, expected_cash, counted_cash, cash_difference, total_cash, total_card, total_sales, payment_count").eq("restaurant_id", restaurant.id).order("opened_at", { ascending: false });
  return <ReportsClient slug={slug} restaurantName={restaurant.name} registers={registers ?? []} />;
}
