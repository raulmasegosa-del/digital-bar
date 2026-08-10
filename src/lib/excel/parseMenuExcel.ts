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

function normalizeHeader(
  value: unknown
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function normalizeText(
  value: unknown
): string {
  return String(value ?? "").trim();
}

function normalizeNumber(
  value: unknown
): number {
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
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    [
      "si",
      "s",
      "yes",
      "y",
      "true",
      "1",
    ].includes(text)
  ) {
    return true;
  }

  if (
    [
      "no",
      "n",
      "false",
      "0",
    ].includes(text)
  ) {
    return false;
  }

  return defaultValue;
}

type NormalizedRow =
  Record<string, unknown>;

function getColumn(
  row: NormalizedRow,
  aliases: string[]
): unknown {
  for (const alias of aliases) {
    const normalizedAlias =
      normalizeHeader(alias);

    if (
      Object.prototype.hasOwnProperty.call(
        row,
        normalizedAlias
      )
    ) {
      return row[normalizedAlias];
    }
  }

  return undefined;
}

export async function parseMenuExcel(
  file: File
): Promise<MenuExcelRow[]> {
  const buffer =
    await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const sheetName =
    workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error(
      "El archivo Excel no contiene ninguna hoja."
    );
  }

  const worksheet =
    workbook.Sheets[sheetName];

  /*
   * Primero obtenemos las filas sin convertir
   * las cabeceras automáticamente.
   */
  const rawRows =
    XLSX.utils.sheet_to_json<
      Record<string, unknown>
    >(worksheet, {
      defval: "",
    });

  /*
   * Normalizamos las cabeceras.
   *
   * Ejemplos:
   *
   * "Categoría" -> "categoria"
   * " CATEGORÍA " -> "categoria"
   * "Pvp"       -> "pvp"
   * "PVP"       -> "pvp"
   */
  const rows =
    rawRows.map((rawRow) => {
      const normalizedRow: NormalizedRow = {};

      for (const [
        key,
        value,
      ] of Object.entries(rawRow)) {
        normalizedRow[
          normalizeHeader(key)
        ] = value;
      }

      return normalizedRow;
    });

  /*
   * Comprobamos las columnas mínimas.
   *
   * Nuestro formato interno es:
   *
   * categoria
   * nombre
   * precio
   *
   * Pero aceptamos nombres habituales:
   *
   * categoria -> categoría
   * nombre    -> producto
   * precio    -> pvp
   */
  const firstRow = rows[0] ?? {};

  const categoryValue =
    getColumn(firstRow, [
      "categoria",
      "categoría",
      "category",
    ]);

  const nameValue =
    getColumn(firstRow, [
      "nombre",
      "producto",
      "name",
    ]);

  const priceValue =
    getColumn(firstRow, [
      "precio",
      "pvp",
      "price",
    ]);

  /*
   * Si no encontramos ninguna de las columnas
   * obligatorias, mostramos un error claro.
   */
  if (
    categoryValue === undefined &&
    nameValue === undefined &&
    priceValue === undefined
  ) {
    throw new Error(
      "No se han encontrado las columnas obligatorias. Se esperan columnas como: Categoría, Producto y Pvp."
    );
  }

  return rows.map(
    (row, index) => ({
      /*
       * +2 porque la fila 1 contiene
       * las cabeceras.
       */
      rowNumber: index + 2,

      categoria: normalizeText(
        getColumn(row, [
          "categoria",
          "categoría",
          "category",
        ])
      ),

      nombre: normalizeText(
        getColumn(row, [
          "nombre",
          "producto",
          "name",
        ])
      ),

      precio: normalizeNumber(
        getColumn(row, [
          "precio",
          "pvp",
          "price",
        ])
      ),

      subtitulo: normalizeText(
        getColumn(row, [
          "subtitulo",
          "subtítulo",
          "subtitle",
        ])
      ),

      descripcion: normalizeText(
        getColumn(row, [
          "descripcion",
          "descripción",
          "description",
        ])
      ),

      disponible: normalizeBoolean(
        getColumn(row, [
          "disponible",
          "availability",
          "available",
        ]),
        true
      ),

      destacado: normalizeBoolean(
        getColumn(row, [
          "destacado",
          "featured",
        ]),
        false
      ),

      tiempo_preparacion:
        getColumn(row, [
          "tiempo_preparacion",
          "tiempo preparacion",
          "tiempo de preparacion",
          "tiempo de preparación",
          "preparation time",
        ]) === "" ||
        getColumn(row, [
          "tiempo_preparacion",
          "tiempo preparacion",
          "tiempo de preparacion",
          "tiempo de preparación",
          "preparation time",
        ]) === undefined ||
        getColumn(row, [
          "tiempo_preparacion",
          "tiempo preparacion",
          "tiempo de preparacion",
          "tiempo de preparación",
          "preparation time",
        ]) === null
          ? null
          : normalizeNumber(
              getColumn(row, [
                "tiempo_preparacion",
                "tiempo preparacion",
                "tiempo de preparacion",
                "tiempo de preparación",
                "preparation time",
              ])
            ),
    })
  );
}