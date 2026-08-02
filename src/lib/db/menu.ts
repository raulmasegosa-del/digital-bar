import { MenuItem } from "@/types/menu";

export function getItemsByCategory(
  items: MenuItem[],
  categoryId: string
) {
  return items.filter(
    (item) => item.categoryId === categoryId
  );
}


export function getFeaturedItems(items: MenuItem[]) {
  return items.filter((item) => item.featured);
}
