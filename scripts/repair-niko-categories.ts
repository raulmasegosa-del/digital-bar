import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

import { supabaseAdmin } from "./utils/supabase";

const slug = getArg("--slug") ?? "demo";
const fileArg = getArg("--file") ?? path.join("imports", "Niko.xlsx");
const apply = process.argv.includes("--apply");

function getArg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

type ExcelRow = {
  Categoría?: string;
  Producto?: string;
};

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

async function main() {
  const absoluteFile = path.resolve(process.cwd(), fileArg);

  if (!fs.existsSync(absoluteFile)) {
    throw new Error(`No existe el Excel: ${absoluteFile}`);
  }

  const workbook = XLSX.readFile(absoluteFile);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

  const categoryProducts = new Map<string, string[]>();

  for (const row of rows) {
    const category = String(row["Categoría"] ?? "").trim();
    const product = String(row["Producto"] ?? "").trim();

    if (!category || !product) continue;

    const list = categoryProducts.get(category) ?? [];
    list.push(product);
    categoryProducts.set(category, list);
  }

  if (categoryProducts.size === 0) {
    throw new Error("No se encontraron categorías y productos en el Excel.");
  }

  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from("restaurants")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (restaurantError) throw restaurantError;
  if (!restaurant) throw new Error(`No existe el restaurante '${slug}'.`);

  const { data: menuItems, error: productsError } = await supabaseAdmin
    .from("menu_items")
    .select("id, name, category_id, restaurant_id")
    .eq("restaurant_id", restaurant.id);

  if (productsError) throw productsError;

  const productByName = new Map<string, { id: string; category_id: string | null }[]>();

  for (const item of menuItems ?? []) {
    const key = normalize(item.name);
    const list = productByName.get(key) ?? [];
    list.push({ id: item.id, category_id: item.category_id });
    productByName.set(key, list);
  }

  const repairs: { category: string; categoryId: string; order: number; matchedProducts: number }[] = [];
  const errors: string[] = [];

  let order = 1;

  for (const [category, products] of categoryProducts) {
    const categoryIds = new Set<string>();
    let matchedProducts = 0;

    for (const product of products) {
      const matches = productByName.get(normalize(product)) ?? [];

      if (matches.length === 0) {
        errors.push(`No encontrado en DEMO: '${product}' (${category})`);
        continue;
      }

      for (const match of matches) {
        if (match.category_id) categoryIds.add(match.category_id);
        matchedProducts++;
      }
    }

    if (categoryIds.size !== 1) {
      errors.push(
        `Categoría '${category}' no puede resolverse de forma segura: ` +
          `${categoryIds.size} category_id distintos encontrados.`
      );
      continue;
    }

    repairs.push({
      category,
      categoryId: [...categoryIds][0],
      order,
      matchedProducts,
    });

    order++;
  }

  console.log(`\nRestaurante: ${restaurant.name} (${restaurant.id})`);
  console.log(`Categorías del Excel: ${categoryProducts.size}`);
  console.log(`Reparaciones seguras: ${repairs.length}`);

  for (const repair of repairs) {
    console.log(
      `  ${repair.categoryId} -> ${repair.category} ` +
        `(productos comprobados: ${repair.matchedProducts})`
    );
  }

  if (errors.length) {
    console.log("\n⚠️ No se aplicará ningún cambio porque hay ambigüedades:");
    for (const error of errors) console.log(`  - ${error}`);
    process.exitCode = 1;
    return;
  }

  if (!apply) {
    console.log(
      "\nModo simulación. Para aplicar exactamente estas reparaciones usa --apply."
    );
    return;
  }

  for (const repair of repairs) {
    const { error } = await supabaseAdmin
      .from("categories")
      .update({
        name: repair.category,
        order: repair.order,
        restaurant_id: restaurant.id,
      })
      .eq("id", repair.categoryId)
      .eq("restaurant_id", restaurant.id);

    if (error) throw error;
  }

  console.log(`\n✅ ${repairs.length} categorías reparadas correctamente.`);
}

main().catch((error) => {
  console.error("\n❌", error);
  process.exit(1);
});
