import { supabaseAdmin } from "@/lib/supabase/server";

export async function createRestaurantTables({
  restaurantId,
  count,
  generateQr = true,
}: {
  restaurantId: string;
  count: number;
  generateQr?: boolean;
}) {
  if (!Number.isInteger(count) || count < 1 || count > 500) {
    throw new Error("El número de mesas debe estar entre 1 y 500.");
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("tables")
    .select("number")
    .eq("restaurant_id", restaurantId)
    .order("number", { ascending: true });

  if (existingError) throw existingError;

  const usedNumbers = new Set((existing ?? []).map((table) => table.number));
  const rows: Array<{
    id: string;
    restaurant_id: string;
    number: number;
    name: string;
    active: boolean;
    qr_token: string | null;
  }> = [];

  let number = 1;
  while (rows.length < count) {
    if (!usedNumbers.has(number)) {
      rows.push({
        id: crypto.randomUUID(),
        restaurant_id: restaurantId,
        number,
        name: `Mesa ${number}`,
        active: true,
        qr_token: generateQr ? crypto.randomUUID() : null,
      });
    }
    number++;
  }

  const { error } = await supabaseAdmin.from("tables").insert(rows);
  if (error) throw error;

  return rows;
}
