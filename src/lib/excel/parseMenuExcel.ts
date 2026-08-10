import * as XLSX from "xlsx";

export type MenuExcelRow = {
  rowNumber: number;
  categoria: string;
  nombre: string;
  precio: number;
  subtitulo: string;
  descripcion: string;
  disponible: boolean;
  destacado: boolean;
  tiempo_preparacion: number | null;
};

function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  const text = String(value ?? "")
    .trim()
    .replace(",", ".");

  if (!text) {
    return NaN;
  }

  return Number(text);
}

function normalizeBoolean(
  value: unknown,
  defaultValue: boolean
): boolean {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const text = String(value)
    .trim()
    .toLowerCase();

  if (
    ["sí", "si", "s", "yes", "y", "true", "1"].includes(
      text
    )
  ) {
    return true;
  }

  if (
    ["no", "n", "false", "0"].includes(text)
  ) {
    return false;
  }

  return defaultValue;
}

export async function parseMenuExcel(
  file: File
): Promise<MenuExcelRow[]> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error(
      "El archivo Excel no contiene ninguna hoja."
    );
  }

  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<
    Record<string, unknown>
  >(worksheet, {
    defval: "",
  });

  return rows.map((row, index) => ({
    // +2 porque la fila 1 contiene las cabeceras
    rowNumber: index + 2,

    categoria: normalizeText(
      row["categoria"]
    ),

    nombre: normalizeText(
      row["nombre"]
    ),

    precio: normalizeNumber(
      row["precio"]
    ),

    subtitulo: normalizeText(
      row["subtitulo"]
    ),

    descripcion: normalizeText(
      row["descripcion"]
    ),

    disponible: normalizeBoolean(
      row["disponible"],
      true
    ),

    destacado: normalizeBoolean(
      row["destacado"],
      false
    ),

    tiempo_preparacion:
      row["tiempo_preparacion"] === "" ||
      row["tiempo_preparacion"] === undefined ||
      row["tiempo_preparacion"] === null
        ? null
        : normalizeNumber(
            row["tiempo_preparacion"]
          ),
  }));
}