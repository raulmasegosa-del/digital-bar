import type { MenuExcelRow } from "./parseMenuExcel";
import type { ExistingProductValidation } from "./validateExistingProducts";
import type { MenuCategoryValidation } from "./validateMenuCategories";

export type ImportSummary = {
  totalRows: number;

  newCategories: number;
  existingCategories: number;

  newProducts: number;
  existingProducts: number;
};

export function buildImportSummary(
  rows: MenuExcelRow[],
  categories: MenuCategoryValidation[],
  products: ExistingProductValidation[]
): ImportSummary {
  const newCategories = categories.filter(
    (category) => !category.exists
  ).length;

  const existingCategories = categories.filter(
    (category) => category.exists
  ).length;

  const newProducts = products.filter(
    (product) => !product.exists
  ).length;

  const existingProducts = products.filter(
    (product) => product.exists
  ).length;

  return {
    totalRows: rows.length,

    newCategories,
    existingCategories,

    newProducts,
    existingProducts,
  };
}