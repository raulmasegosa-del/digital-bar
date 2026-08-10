import { supabaseAdmin } from "@/lib/supabase/server";
import type { MenuExcelRow } from "./parseMenuExcel";

export type MenuCategoryValidation = {
  name: string;
  exists: boolean;
  id: string | null;
};

export async function validateMenuCategories(
  restaurantId: string,
  rows: MenuExcelRow[]
): Promise<MenuCategoryValidation[]> {
  if (!restaurantId) {
    throw new Error("El restaurante es obligatorio.");
  }

  const categoryNames = Array.from(
    new Set(
      rows
        .map((row) => row.categoria.trim())
        .filter(Boolean)
    )
  );

  if (categoryNames.length === 0) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id, name")
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw error;
  }

  const categories = data ?? [];

  return categoryNames.map((name) => {
    const existing = categories.find(
      (category) =>
        category.name.trim().toLowerCase() ===
        name.toLowerCase()
    );

    return {
      name,
      exists: Boolean(existing),
      id: existing?.id ?? null,
    };
  });
}