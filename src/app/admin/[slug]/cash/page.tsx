import { notFound } from "next/navigation";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";
import CashRegisterPanel from "@/components/admin/CashRegisterPanel";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function CashPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();
  const superAdmin = await isSuperAdmin(user.id);
  if (!superAdmin) {
    const { data: membership } = await supabase.from("restaurant_users").select("restaurant_id").eq("user_id", user.id).eq("restaurant_id", restaurant.id).in("role", ["owner", "staff"]).maybeSingle();
    if (!membership) notFound();
  }
  const { data: open } = await supabaseAdmin.from("cash_registers").select("id, opening_cash, opened_at").eq("restaurant_id", restaurant.id).is("closed_at", null).maybeSingle();
  const { data: payments } = open ? await supabaseAdmin.from("payments").select("amount, payment_method").eq("cash_register_id", open.id) : { data: [] };
  const cash = (payments ?? []).filter((p) => p.payment_method === "cash").reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const card = (payments ?? []).filter((p) => p.payment_method === "card").reduce((s, p) => s + Number(p.amount ?? 0), 0);
  return <main className="min-h-screen bg-[#11100f] text-white"><div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8"><div className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-500">Caja</p><h1 className="mt-2 text-4xl font-black">Caja del día</h1><p className="mt-2 text-sm text-zinc-400">Control de apertura, cobros y cierre de jornada.</p></div><CashRegisterPanel slug={slug} open={open} totals={{ cash, card, sales: cash + card }} /></div></main>;
}
