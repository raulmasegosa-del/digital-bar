export type MenuCategory = {
  id: string;
  name: string;
  icon: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;

  name: string;
  description: string;
  price: number;

  image?: string;

  featured?: boolean;

  available?: boolean;

  allergens?: string[];

  tags?: string[];
};