import { MenuItem } from "@/types/menu";

export function getItemsByCategory(
  items: MenuItem[],
  categoryId: string
) {
  return items.filter(
    (item) => item.categoryId === categoryId
  );
}