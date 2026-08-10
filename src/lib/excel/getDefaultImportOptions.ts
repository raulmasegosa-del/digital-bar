import type { ImportOptions } from "./importTypes";

export function getDefaultImportOptions(): ImportOptions {
  return {
    existingCategory: "ignore",
    existingProduct: "ignore",
    emptyFields: "keep",
  };
}