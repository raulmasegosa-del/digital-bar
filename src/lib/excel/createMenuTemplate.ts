import * as XLSX from "xlsx";

const headers = [
  "categoria",
  "nombre",
  "precio",
  "subtitulo",
  "descripcion",
  "disponible",
  "destacado",
  "tiempo_preparacion",
];

const exampleRows = [
  [
    "Hamburguesas",
    "Hamburguesa Digital",
    12.5,
    "Con queso cheddar",
    "Carne 180 g, queso cheddar y patatas",
    "Sí",
    "No",
    15,
  ],
  [
    "Hamburguesas",
    "Bacon Burger",
    13.9,
    "Bacon y cheddar",
    "Carne 180 g, bacon y queso cheddar",
    "Sí",
    "Sí",
    15,
  ],
  [
    "Bebidas",
    "Coca-Cola",
    2.5,
    "",
    "Refresco",
    "Sí",
    "No",
    "",
  ],
];

const instructions = [
  ["COLUMNA", "TIPO", "OBLIGATORIO", "DESCRIPCIÓN"],
  [
    "categoria",
    "Texto",
    "Sí",
    "Nombre de la categoría",
  ],
  [
    "nombre",
    "Texto",
    "Sí",
    "Nombre del producto",
  ],
  [
    "precio",
    "Número",
    "Sí",
    "Precio en euros. Ejemplo: 12.50",
  ],
  [
    "subtitulo",
    "Texto",
    "No",
    "Texto corto opcional",
  ],
  [
    "descripcion",
    "Texto",
    "No",
    "Descripción del producto",
  ],
  [
    "disponible",
    "Sí / No",
    "No",
    "Por defecto: Sí",
  ],
  [
    "destacado",
    "Sí / No",
    "No",
    "Por defecto: No",
  ],
  [
    "tiempo_preparacion",
    "Número entero",
    "No",
    "Minutos de preparación",
  ],
  [],
  ["NOTAS"],
  [
    "Los campos marcados como obligatorios deben contener datos."
  ],
  [
    "El precio acepta formatos como 12.50 y 12,50."
  ],
  [
    "Los campos Sí/No aceptan Sí, Si, No, true, false, 1 y 0."
  ],
  [
    "No es necesario introducir fechas ni identificadores."
  ],
];

export function createMenuTemplate(): Buffer {
  const workbook = XLSX.utils.book_new();

  // Hoja principal
  const productsSheet =
    XLSX.utils.aoa_to_sheet([
      headers,
      ...exampleRows,
    ]);

  // Anchos de columna
  productsSheet["!cols"] = [
    { wch: 20 },
    { wch: 30 },
    { wch: 12 },
    { wch: 25 },
    { wch: 45 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    productsSheet,
    "Productos"
  );

  // Hoja de instrucciones
  const instructionsSheet =
    XLSX.utils.aoa_to_sheet(instructions);

  instructionsSheet["!cols"] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 16 },
    { wch: 65 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    instructionsSheet,
    "Instrucciones"
  );

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
}