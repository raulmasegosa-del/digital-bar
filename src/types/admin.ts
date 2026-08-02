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
export type OptionItem = {
  id: string;
  group_id: string;
  name: string;
  extra_price: number;
  order: number;
  available: boolean;

  option_groups?: {
    name: string;
  };
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
export type AdminOptionItem = {
  id: string;
  group_id: string;
  name: string;
  extra_price: number;
  order: number;
  available: boolean;

  option_groups?: {
    name: string;
  };
};