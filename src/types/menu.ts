export type MenuCategory = {
  id: string;
  name: string;
  icon: string;
};

export type MenuPrice = {
  label: string;
  price: number;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  subtitle?: string;
  description: string;

  prices: MenuPrice[];

  image?: string;

  featured?: boolean;

  available?: boolean;

  allergens?: string[];

  order: number;

  tags?: string[];
};