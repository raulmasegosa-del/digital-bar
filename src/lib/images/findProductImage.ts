import { supabaseAdmin } from "@/lib/supabase/server";

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
  const productKey = normalize(productName);
  const { data, error } = await supabaseAdmin.storage
    .from("products")
    .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } });

  if (error || !data) return null;

  const candidates = data
    .filter((entry) => entry.id && imageExtensions.has(`.${entry.name.split(".").pop()?.toLowerCase() ?? ""}`))
    .map((entry) => ({
      name: entry.name,
      key: normalize(entry.name),
    }));

  const exact = candidates.find((candidate) => candidate.key === productKey);
  const startsWith = candidates.find(
    (candidate) =>
      candidate.key.startsWith(`${productKey}-`) ||
      productKey.startsWith(`${candidate.key}-`)
  );

  const match = exact ?? startsWith;
  if (!match) return null;

  const { data: publicUrl } = supabaseAdmin.storage
    .from("products")
    .getPublicUrl(match.name);

  return publicUrl.publicUrl;
}
