import path from "path";

import { readExcel } from "./utils/readExcel";
import { importCategories } from "./utils/importCategories";
import { importProducts } from "./utils/importProducts";
import { importPrices } from "./utils/importPrices";

async function main() {
  const filePath = path.join(
    process.cwd(),
    "imports",
    "Niko.xlsx"
  );

  console.log("📄 Leyendo:", filePath);

  const products = readExcel(filePath);

  console.log(
    `📦 Productos encontrados: ${products.length}`
  );

  const categories = [
    ...new Set(
      products.map((p) => p.category)
    ),
  ];

  console.log(
    `📂 Categorías encontradas: ${categories.length}`
  );

  await importCategories(categories);

  await importProducts(products);

  await importPrices(products);

  console.log(
    "\n🎉 Importación completada correctamente"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});