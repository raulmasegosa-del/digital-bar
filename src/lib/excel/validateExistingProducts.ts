import { supabaseAdmin } from "@/lib/supabase/server";

import type { MenuExcelRow } from "./parseMenuExcel";

export type ExistingProductValidation = {
  rowNumber: number;
  name: string;
  categoryName: string;
  exists: boolean;
  id: string | null;
};

export async function validateExistingProducts(
  restaurantId: string,
  rows: MenuExcelRow[]
): Promise<ExistingProductValidation[]> {
  if (!restaurantId) {
    throw new Error("El restaurante es obligatorio.");
  }

  /*
   * Obtenemos los productos del restaurante.
   * No hacemos aquí el join con categories para evitar
   * problemas de tipado de Supabase.
   */
  const { data: products, error: productsError } =
    await supabaseAdmin
      .from("menu_items")
      .select(
        "id, name, category_id"
      )
      .eq("restaurant_id", restaurantId);

  if (productsError) {
    throw productsError;
  }

  /*
   * Obtenemos las categorías del restaurante.
   */
  const { data: categories, error: categoriesError } =
    await supabaseAdmin
      .from("categories")
      .select("id, name")
      .eq("restaurant_id", restaurantId);

  if (categoriesError) {
    throw categoriesError;
  }

  const productRows = products ?? [];
  const categoryRows = categories ?? [];

  return rows.map((row) => {
    const categoryName = row.categoria
      .trim()
      .toLowerCase();

    const productName = row.nombre
      .trim()
      .toLowerCase();

    /*
     * Buscamos primero la categoría correspondiente.
     */
    const category = categoryRows.find(
      (item) =>
        item.name
          .trim()
          .toLowerCase() === categoryName
    );

    /*
     * Si no existe la categoría todavía,
     * el producto tampoco puede considerarse
     * un producto existente.
     */
    if (!category) {
      return {
        rowNumber: row.rowNumber,
        name: row.nombre,
        categoryName: row.categoria,
        exists: false,
        id: null,
      };
    }

    /*
     * Producto existente =
     * misma categoría + mismo nombre.
     */
    const existing = productRows.find(
      (product) =>
        product.category_id === category.id &&
        product.name
          .trim()
          .toLowerCase() === productName
    );

    return {
      rowNumber: row.rowNumber,
      name: row.nombre,
      categoryName: row.categoria,
      exists: Boolean(existing),
      id: existing?.id ?? null,
    };
  });
}