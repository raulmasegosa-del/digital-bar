import { supabaseAdmin } from "./supabase";
import { slugify } from "./slugify";
import type { ExcelProduct } from "./readExcel";

export async function importProducts(
  products: ExcelProduct[]
) {
  console.log(
    "\n🍔 Importando productos...\n"
  );

  let created = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const id = slugify(product.name);

    const categoryId = slugify(
      product.category
    );

    const {
      data: existing,
      error: selectError,
    } = await supabaseAdmin
      .from("menu_items")
      .select("id")
      .eq("id", id)
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
      .from("menu_items")
      .insert({
        id,
        category_id: categoryId,

        name: product.name,

        featured: false,
        available: true,

        order: i + 1,
      });

    if (insertError) {
      throw insertError;
    }

    created++;

    console.log(`✅ ${product.name}`);
  }

  console.log(
    `\n✔ ${created} productos creados`
  );
}