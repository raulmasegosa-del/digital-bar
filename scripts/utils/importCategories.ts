import { supabaseAdmin } from "./supabase";
import { slugify } from "./slugify";

export async function importCategories(
  categories: string[]
) {
  console.log(
    "\n📂 Importando categorías...\n"
  );

  let created = 0;

  for (let i = 0; i < categories.length; i++) {
    const name = categories[i];

    const id = slugify(name);

    const {
      data: existing,
      error: selectError,
    } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    if (existing) {
      console.log(`⏭️ ${name}`);
      continue;
    }

    const {
      error: insertError,
    } = await supabaseAdmin
      .from("categories")
      .insert({
        id,
        name,
        icon: "🍽️",
        description: "",
        order: i + 1,
      });

    if (insertError) {
      throw insertError;
    }

    created++;

    console.log(`✅ ${name}`);
  }

  console.log(
    `\n✔ ${created} categorías creadas`
  );
}