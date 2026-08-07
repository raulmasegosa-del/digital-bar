import * as XLSX from "xlsx";
import { parsePrice } from "./parsePrice";

export type ExcelProduct = {
  category: string;
  name: string;
  price: number;
};

export function readExcel(
  filePath: string
): ExcelProduct[] {

  const workbook =
    XLSX.readFile(filePath);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    XLSX.utils.sheet_to_json<
      Record<string, unknown>
    >(sheet);

  return rows.map((row) => ({

    category: String(
      row["Categoría"] ?? ""
    ).trim(),

    name: String(
      row["Producto"] ?? ""
    ).trim(),

    price: parsePrice(
      row["Pvp"]
    ),

  }));
}