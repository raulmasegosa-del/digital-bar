import type { MenuExcelRow } from "./parseMenuExcel";

export type MenuExcelError = {
  rowNumber: number;
  field: keyof MenuExcelRow | "general";
  message: string;
};

export type MenuExcelValidationResult = {
  valid: boolean;
  rows: MenuExcelRow[];
  errors: MenuExcelError[];
};

export function validateMenuExcel(
  rows: MenuExcelRow[]
): MenuExcelValidationResult {
  const errors: MenuExcelError[] = [];

  const seenProducts = new Set<string>();

  rows.forEach((row) => {
    const productKey =
      `${row.categoria.trim().toLowerCase()}::` +
      `${row.nombre.trim().toLowerCase()}`;

    // Categoría
    if (!row.categoria) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "categoria",
        message: "La categoría es obligatoria.",
      });
    }

    // Nombre
    if (!row.nombre) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "nombre",
        message: "El nombre del producto es obligatorio.",
      });
    }

    // Precio
    if (!Number.isFinite(row.precio)) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "precio",
        message: "El precio debe ser un número válido.",
      });
    } else if (row.precio < 0) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "precio",
        message: "El precio no puede ser negativo.",
      });
    }

    // Tiempo de preparación
    if (
      row.tiempo_preparacion !== null &&
      (
        !Number.isFinite(
          row.tiempo_preparacion
        ) ||
        row.tiempo_preparacion < 0 ||
        !Number.isInteger(
          row.tiempo_preparacion
        )
      )
    ) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "tiempo_preparacion",
        message:
          "El tiempo de preparación debe ser un número entero de minutos.",
      });
    }

    // Duplicados dentro del propio Excel
    if (row.categoria && row.nombre) {
      if (seenProducts.has(productKey)) {
        errors.push({
          rowNumber: row.rowNumber,
          field: "nombre",
          message:
            "Este producto aparece duplicado en el Excel.",
        });
      } else {
        seenProducts.add(productKey);
      }
    }
  });

  return {
    valid: errors.length === 0,
    rows,
    errors,
  };
}