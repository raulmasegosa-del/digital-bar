export type AdminCategory = {
  id: string;
  name: string;
  order?: number;
};

export type AdminPrice = {
  id: string;
  item_id: string;
  label: string;
  price: number;
};

export type AdminProduct = {
  id: string;
  name: string;
  subtitle?: string | null;
  description?: string | null;
  image?: string | null;
  available: boolean;
  featured: boolean;
  category_id: string;
  order?: number;

  categories?: {
    name: string;
  };

  menu_prices?: AdminPrice[];
};