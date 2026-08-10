"use client";

import { useRef, useState } from "react";

import {
  parseMenuExcel,
  type MenuExcelRow,
} from "@/lib/excel/parseMenuExcel";
import { validateMenuExcel } from "@/lib/excel/validateMenuExcel";

type Props = {
  slug: string;
};

export default function MenuExcelUploader({
  slug,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const [validationErrors, setValidationErrors] =
    useState<
      {
        rowNumber: number;
        field: string;
        message: string;
      }[]
    >([]);

  const [rows, setRows] = useState<MenuExcelRow[]>([]);

  const [rowCount, setRowCount] = useState(0);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    setError("");
    setFileName("");
    setValidationErrors([]);
    setRows([]);
    setRowCount(0);
    setValid(false);

    if (!file) {
      return;
    }

    const isExcel =
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls");

    if (!isExcel) {
      setError(
        "Selecciona un archivo Excel (.xlsx o .xls)."
      );

      event.target.value = "";
      return;
    }

    setLoading(true);
    setFileName(file.name);

    try {
      const parsedRows = await parseMenuExcel(file);

      const result = validateMenuExcel(parsedRows);

      setRows(parsedRows);
      setRowCount(parsedRows.length);
      setValidationErrors(result.errors);
      setValid(result.valid);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se ha podido leer el archivo Excel."
      );

      setFileName("");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectClick() {
    inputRef.current?.click();
  }

  return (
    <div className="mt-6">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleSelectClick}
        disabled={loading}
        className="w-full rounded-xl border-2 border-dashed px-6 py-10 text-center transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
      >
        <div className="text-4xl">
          {loading ? "⏳" : "📊"}
        </div>

        <div className="mt-3 font-semibold">
          {loading
            ? "Analizando Excel..."
            : "Seleccionar archivo Excel"}
        </div>

        <div className="mt-1 text-sm text-gray-500">
          Formatos admitidos: .xlsx y .xls
        </div>
      </button>

      {fileName && !loading && (
        <div
          className={`mt-4 rounded-xl border p-4 ${
            valid
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              valid
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            📄 {fileName}
          </p>

          <p
            className={`mt-1 text-sm ${
              valid
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {rowCount}{" "}
            {rowCount === 1 ? "fila" : "filas"} detectadas
          </p>

          {valid && (
            <p className="mt-2 text-sm font-medium text-green-800">
              ✓ El Excel es válido y está preparado para
              continuar.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            {error}
          </p>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-red-800">
              Errores encontrados
            </h3>

            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              {validationErrors.length}
            </span>
          </div>

          <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
            {validationErrors.map(
              (validationError, index) => (
                <div
                  key={`${validationError.rowNumber}-${validationError.field}-${index}`}
                  className="rounded-lg bg-red-50 px-3 py-2"
                >
                  <p className="text-sm font-medium text-red-800">
                    Fila{" "}
                    {validationError.rowNumber}
                    {validationError.field !==
                      "general" &&
                      ` · ${validationError.field}`}
                  </p>

                  <p className="text-sm text-red-700">
                    {validationError.message}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {valid && rows.length > 0 && (
        <div className="mt-6 rounded-xl border bg-white">
          <div className="border-b p-4">
            <h3 className="font-semibold">
              Vista previa
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Mostrando las primeras{" "}
              {Math.min(rows.length, 10)} filas del Excel.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Fila
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Categoría
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Producto
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Precio
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Subtítulo
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Disponible
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Destacado
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Preparación
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {rows.slice(0, 10).map((row) => (
                  <tr key={row.rowNumber}>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {row.rowNumber}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {row.categoria}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium">
                      {row.nombre}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {row.precio.toFixed(2)} €
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.subtitulo || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {row.disponible ? "Sí" : "No"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {row.destacado ? "Sí" : "No"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {row.tiempo_preparacion !== null
                        ? `${row.tiempo_preparacion} min`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length > 10 && (
            <div className="border-t p-4 text-center text-sm text-gray-500">
              Hay {rows.length - 10} filas más que se
              procesarán al continuar.
            </div>
          )}
        </div>
      )}

      {valid && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            El archivo ha pasado la validación.
          </p>

          <p className="mt-1 text-sm text-amber-800">
            El siguiente paso será comprobar las
            categorías y productos que ya existen antes
            de realizar la importación.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Restaurante: {slug}
      </p>
    </div>
  );
}