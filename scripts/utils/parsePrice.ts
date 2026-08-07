export function parsePrice(value: unknown): number {
  // Excel ya devuelve un número
  if (typeof value === "number") {
    return Number(value.toFixed(2));
  }

  // Convertimos cualquier otro formato a texto
  const normalized = String(value ?? "")
    .trim()
    .replace(/€/g, "")
    .replace(/\s/g, "")
    .replace(",", ".");

  const price = Number(normalized);

  if (Number.isNaN(price)) {
    throw new Error(
      `Precio inválido: "${value}"`
    );
  }

  return Number(price.toFixed(2));
}