"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  analyzeMenuImport,
  importMenuExcel,
} from "@/app/super/actions";

import { parseMenuExcel } from "@/lib/excel/parseMenuExcel";
import { validateMenuExcel } from "@/lib/excel/validateMenuExcel";
import type { MenuExcelRow } from "@/lib/excel/parseMenuExcel";

import { getDefaultImportOptions } from "@/lib/excel/getDefaultImportOptions";
import type { ImportOptions } from "@/lib/excel/importTypes";

type Props = {
  slug: string;
  restaurantId: string;
};

type ImportResult = {
  success: boolean;
  totalRows: number;
  createdCategories: number;
  createdProducts: number;
  updatedProducts: number;
  ignoredProducts: number;
};

export default function MenuExcelUploader({
  slug,
  restaurantId,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [fileName, setFileName] =
    useState("");

  const [error, setError] =
    useState("");

  const [validationErrors, setValidationErrors] =
    useState<
      {
        rowNumber: number;
        field: string;
        message: string;
      }[]
    >([]);

  const [rowCount, setRowCount] =
    useState(0);

  const [rows, setRows] =
    useState<MenuExcelRow[]>([]);

  const [valid, setValid] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [importing, setImporting] =
    useState(false);

  const [importAnalysis, setImportAnalysis] =
    useState<
      Awaited<
        ReturnType<typeof analyzeMenuImport>
      > | null
    >(null);

  const [importOptions, setImportOptions] =
    useState<ImportOptions>(
      getDefaultImportOptions()
    );

  const [importResult, setImportResult] =
    useState<ImportResult | null>(null);

  function resetAnalysis() {
    setImportAnalysis(null);
    setImportResult(null);
    setImportOptions(
      getDefaultImportOptions()
    );
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    setError("");
    setFileName("");
    setValidationErrors([]);
    setRowCount(0);
    setRows([]);
    setValid(false);
    resetAnalysis();

    if (!file) {
      return;
    }

    const isExcel =
      file.name
        .toLowerCase()
        .endsWith(".xlsx") ||
      file.name
        .toLowerCase()
        .endsWith(".xls");

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
      const parsedRows =
        await parseMenuExcel(file);

      const result =
        validateMenuExcel(parsedRows);

      setRows(parsedRows);
      setRowCount(parsedRows.length);
      setValidationErrors(
        result.errors
      );
      setValid(result.valid);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se ha podido leer el archivo Excel."
      );

      setFileName("");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectClick() {
    if (importing) {
      return;
    }

    inputRef.current?.click();
  }

  async function handleAnalyzeImport() {
    if (!valid || rows.length === 0) {
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const result =
        await analyzeMenuImport(
          restaurantId,
          rows
        );

      setImportAnalysis(result);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se ha podido analizar la importación."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  function updateImportOption(
    field: keyof ImportOptions,
    value: string
  ) {
    setImportOptions((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleImport() {
    if (
      !valid ||
      rows.length === 0 ||
      !importAnalysis ||
      importing ||
      importResult
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "La importación va a modificar la carta del restaurante. ¿Quieres continuar?"
      );

    if (!confirmed) {
      return;
    }

    setImporting(true);
    setError("");

    try {
      const result =
        await importMenuExcel(
          restaurantId,
          rows,
          importOptions
        );

      setImportResult(result);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se ha podido completar la importación."
      );
    } finally {
      setImporting(false);
    }
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
        disabled={
          loading ||
          analyzing ||
          importing
        }
        className="w-full rounded-xl border-2 border-dashed px-6 py-10 text-center transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
      >
        <div className="text-4xl">
          {loading ? "⏳" : "📊"}
        </div>

        <div className="mt-3 font-semibold">
          {loading
            ? "Analizando Excel..."
            : importing
              ? "Importando carta..."
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
            {rowCount === 1
              ? "fila"
              : "filas"}{" "}
            detectadas
          </p>

          {valid && (
            <p className="mt-2 text-sm font-medium text-green-800">
              ✓ El Excel es válido y está preparado
              para continuar.
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

      {valid && !importAnalysis && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            El archivo ha pasado la validación.
          </p>

          <p className="mt-1 text-sm text-amber-800">
            Continúa para comprobar las categorías y
            productos que ya existen en el restaurante.
          </p>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAnalyzeImport}
              disabled={analyzing}
              className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-60"
            >
              {analyzing
                ? "Comprobando..."
                : "Continuar"}
            </button>
          </div>
        </div>
      )}

      {importAnalysis && !importResult && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">
              Resumen de la importación
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Hemos comprobado el Excel contra la carta
              actual de este restaurante.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Filas
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {
                    importAnalysis.summary
                      .totalRows
                  }
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Categorías nuevas
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {
                    importAnalysis.summary
                      .newCategories
                  }
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Categorías existentes
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {
                    importAnalysis.summary
                      .existingCategories
                  }
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Productos nuevos
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {
                    importAnalysis.summary
                      .newProducts
                  }
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Productos existentes
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {
                    importAnalysis.summary
                      .existingProducts
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">
              Opciones de importación
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Decide qué debe hacer Super cuando
              encuentre información que ya existe.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="existing-category"
                  className="block font-semibold"
                >
                  Categoría existente
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  ¿Qué hacemos si la categoría ya existe?
                </p>

                <select
                  id="existing-category"
                  value={
                    importOptions.existingCategory
                  }
                  onChange={(event) =>
                    updateImportOption(
                      "existingCategory",
                      event.target.value
                    )
                  }
                  disabled={importing}
                  className="mt-3 w-full rounded-xl border p-3 disabled:opacity-60"
                >
                  <option value="ignore">
                    Ignorar categoría existente
                  </option>

                  <option value="overwrite">
                    Sobrescribir categoría existente
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="existing-product"
                  className="block font-semibold"
                >
                  Producto existente
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  ¿Qué hacemos si el producto ya existe?
                </p>

                <select
                  id="existing-product"
                  value={
                    importOptions.existingProduct
                  }
                  onChange={(event) =>
                    updateImportOption(
                      "existingProduct",
                      event.target.value
                    )
                  }
                  disabled={importing}
                  className="mt-3 w-full rounded-xl border p-3 disabled:opacity-60"
                >
                  <option value="ignore">
                    Ignorar producto existente
                  </option>

                  <option value="overwrite">
                    Sobrescribir producto existente
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="empty-fields"
                  className="block font-semibold"
                >
                  Campos vacíos
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  ¿Qué hacemos cuando una celda del Excel
                  está vacía?
                </p>

                <select
                  id="empty-fields"
                  value={
                    importOptions.emptyFields
                  }
                  onChange={(event) =>
                    updateImportOption(
                      "emptyFields",
                      event.target.value
                    )
                  }
                  disabled={importing}
                  className="mt-3 w-full rounded-xl border p-3 disabled:opacity-60"
                >
                  <option value="keep">
                    Mantener el valor actual
                  </option>

                  <option value="clear">
                    Sobrescribir con vacío
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">
                Todo listo para importar
              </p>

              <p className="mt-1 text-sm text-amber-800">
                Revisa las opciones anteriores. Al
                pulsar importar se modificarán los datos
                del restaurante.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleImport}
                disabled={importing}
                className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-60"
              >
                {importing
                  ? "Importando..."
                  : "Importar carta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {importResult && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              ✓
            </div>

            <div>
              <h3 className="text-lg font-bold text-green-900">
                Importación completada
              </h3>

              <p className="mt-1 text-sm text-green-800">
                La carta se ha procesado correctamente.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-gray-500">
                Filas procesadas
              </p>

              <p className="mt-1 text-2xl font-bold">
                {importResult.totalRows}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-gray-500">
                Categorías creadas
              </p>

              <p className="mt-1 text-2xl font-bold">
                {importResult.createdCategories}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-gray-500">
                Productos creados
              </p>

              <p className="mt-1 text-2xl font-bold">
                {importResult.createdProducts}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-gray-500">
                Productos actualizados
              </p>

              <p className="mt-1 text-2xl font-bold">
                {importResult.updatedProducts}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-gray-500">
                Productos ignorados
              </p>

              <p className="mt-1 text-2xl font-bold">
                {importResult.ignoredProducts}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-green-200 bg-white p-4">
            <p className="text-sm text-green-800">
              La importación ya se ha aplicado a la base
              de datos. No vuelvas a pulsar el botón para
              este mismo archivo.
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Restaurante: {slug}
      </p>
    </div>
  );
}