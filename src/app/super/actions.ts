"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createRestaurantRecord } from "@/lib/db/restaurants/createRestaurantRecord";
import { createRestaurantSettings } from "@/lib/db/restaurants/createRestaurantSettings";
import { createRestaurantProduct } from "@/lib/db/restaurants/products/createRestaurantProduct";
import { updateRestaurantProduct } from "@/lib/db/restaurants/products/updateRestaurantProduct";

import { supabaseAdmin } from "@/lib/supabase/server";

import type { MenuExcelRow } from "@/lib/excel/parseMenuExcel";

import {
  validateMenuCategories,
  type MenuCategoryValidation,
} from "@/lib/excel/validateMenuCategories";

import {
  validateExistingProducts,
  type ExistingProductValidation,
} from "@/lib/excel/validateExistingProducts";

import {
  buildImportSummary,
  type ImportSummary,
} from "@/lib/excel/buildImportSummary";

import type { ImportOptions } from "@/lib/excel/importTypes";


export async function createRestaurant(
  formData: FormData
) {
  const name =
    (formData.get("name") as string)?.trim();

  const slug =
    (formData.get("slug") as string)?.trim();

  const website =
    (formData.get("website") as string)?.trim() ||
    null;

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  if (!slug) {
    throw new Error("El slug es obligatorio.");
  }

  // 1. Crear restaurante
  const restaurant =
    await createRestaurantRecord(
      name,
      slug,
      website
    );

  // 2. Crear configuración inicial
  await createRestaurantSettings(
    restaurant.id,
    name
  );

  revalidatePath("/super/restaurants");

  redirect("/super/restaurants");
}


export async function analyzeMenuImport(
  restaurantId: string,
  rows: MenuExcelRow[]
): Promise<{
  summary: ImportSummary;
  categories: MenuCategoryValidation[];
  products: ExistingProductValidation[];
}> {
  if (!restaurantId) {
    throw new Error(
      "El restaurante es obligatorio."
    );
  }

  if (!rows.length) {
    throw new Error(
      "No hay filas para analizar."
    );
  }

  const categories =
    await validateMenuCategories(
      restaurantId,
      rows
    );

  const products =
    await validateExistingProducts(
      restaurantId,
      rows
    );

  const summary =
    buildImportSummary(
      rows,
      categories,
      products
    );

  return {
    summary,
    categories,
    products,
  };
}


export async function importMenuExcel(
  restaurantId: string,
  rows: MenuExcelRow[],
  options: ImportOptions
) {
  if (!restaurantId) {
    throw new Error(
      "El restaurante es obligatorio."
    );
  }

  if (!rows.length) {
    throw new Error(
      "No hay filas para importar."
    );
  }

  /*
   * Volvemos a validar en el servidor.
   * No confiamos en la validación realizada
   * previamente por el navegador.
   */
  const categories =
    await validateMenuCategories(
      restaurantId,
      rows
    );

  const products =
    await validateExistingProducts(
      restaurantId,
      rows
    );

  /*
   * Guardamos cuántas categorías eran nuevas
   * antes de modificar el resultado de validación.
   */
  const newCategoryCount =
    categories.filter(
      (category) => !category.exists
    ).length;

  /*
   * Mapa de categorías por nombre normalizado.
   */
  const categoryMap =
    new Map<
      string,
      MenuCategoryValidation
    >();

  for (const category of categories) {
    categoryMap.set(
      category.name
        .trim()
        .toLowerCase(),
      category
    );
  }

  /*
   * Crear categorías nuevas.
   */
  for (const category of categories) {
    if (category.exists) {
      continue;
    }

    const categoryId =
      crypto.randomUUID();

    const { error } =
      await supabaseAdmin
        .from("categories")
        .insert({
          id: categoryId,
          restaurant_id: restaurantId,
          name: category.name.trim(),
        });

    if (error) {
      throw error;
    }

    category.id = categoryId;
    category.exists = true;

    categoryMap.set(
      category.name
        .trim()
        .toLowerCase(),
      category
    );
  }

  let createdProducts = 0;
  let updatedProducts = 0;
  let ignoredProducts = 0;

  /*
   * Importar producto por producto.
   */
  for (const row of rows) {
    const categoryKey =
      row.categoria
        .trim()
        .toLowerCase();

    const category =
      categoryMap.get(categoryKey);

    if (!category?.id) {
      throw new Error(
        `No se ha podido determinar la categoría de la fila ${row.rowNumber}.`
      );
    }

    const productValidation =
      products.find(
        (product) =>
          product.rowNumber ===
          row.rowNumber
      );

    /*
     * Producto existente.
     */
    if (
      productValidation?.exists &&
      productValidation.id
    ) {
      if (
        options.existingProduct ===
        "ignore"
      ) {
        ignoredProducts++;
        continue;
      }

      await updateRestaurantProduct({
        restaurantId,
        productId:
          productValidation.id,
        categoryId: category.id,
        name: row.nombre,
        price: row.precio,
        subtitle: row.subtitulo,
        description: row.descripcion,
        available: row.disponible,
        featured: row.destacado,
        preparationTime:
          row.tiempo_preparacion,
        emptyFields:
          options.emptyFields,
      });

      updatedProducts++;
      continue;
    }

    /*
     * Producto nuevo.
     */
    await createRestaurantProduct({
      restaurantId,
      categoryId: category.id,
      name: row.nombre,
      price: row.precio,
      subtitle: row.subtitulo,
      description: row.descripcion,
      available: row.disponible,
      featured: row.destacado,
      preparationTime:
        row.tiempo_preparacion,
    });

    createdProducts++;
  }

  revalidatePath(
    `/super/restaurants/${restaurantId}/import`
  );

  revalidatePath(
    "/super/restaurants"
  );

  revalidatePath("/admin");

  revalidatePath("/");

  return {
    success: true,
    totalRows: rows.length,
    createdCategories:
      newCategoryCount,
    createdProducts,
    updatedProducts,
    ignoredProducts,
  };
}