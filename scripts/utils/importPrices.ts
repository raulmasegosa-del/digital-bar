import { supabaseAdmin } from "./supabase";
import { slugify } from "./slugify";
import type { ExcelProduct } from "./readExcel";

export async function importPrices(
  products: ExcelProduct[]
) {
  console.log(
    "\n💰 Importando precios...\n"
  );

  let created = 0;

  for (const product of products) {
    const itemId = slugify(product.name);

    const {
      data: existing,
      error: selectError,
    } = await supabaseAdmin
      .from("menu_prices")
      .select("id")
      .eq("item_id", itemId)
      .eq("label", "Normal")
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    if (existing) {
      console.log(`⏭️ ${product.name}`);
      continue;
    }

    const {
      error: insertError,
    } = await supabaseAdmin
      .from("menu_prices")
      .insert({
        item_id: itemId,
        label: "Normal",
        price: product.price,
        order: 1,
      });

    if (insertError) {
      throw insertError;
    }

    created++;

    console.log(
      `✅ ${product.name} · ${product.price.toFixed(2)} €`
    );
  }

  console.log(
    `\n✔ ${created} precios creados`
  );
}