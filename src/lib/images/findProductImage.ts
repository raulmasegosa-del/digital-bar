import { readdir } from "node:fs/promises";
import path from "node:path";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function findProductImage({
  categoryName,
  productName,
}: {
  categoryName: string;
  productName: string;
}) {
  const categoryFolder = normalize(categoryName);
  const baseDir = path.join(process.cwd(), "product-images", categoryFolder);

  let entries;
  try {
    entries = await readdir(baseDir, { withFileTypes: true });
  } catch {
    return null;
  }

  const productKey = normalize(productName);
  const candidates = entries
    .filter((entry) => entry.isFile())
    .filter((entry) => imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => ({
      name: entry.name,
      key: normalize(entry.name),
    }));

  const exact = candidates.find((candidate) => candidate.key === productKey);
  const startsWith = candidates.find(
    (candidate) => candidate.key.startsWith(`${productKey}-`) || productKey.startsWith(`${candidate.key}-`)
  );

  const match = exact ?? startsWith;
  return match ? `/product-images/${categoryFolder}/${encodeURIComponent(match.name)}` : null;
}
