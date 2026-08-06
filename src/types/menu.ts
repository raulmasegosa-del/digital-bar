export type MenuPrice = {
  id: number;
  item_id: string;
  label: string | null;
  price: number;
  order?: number;
};

export type MenuOptionItem = {
  id: string;
  group_id: string;
  name: string;
  extra_price: number;
  order: number;
  available: boolean;
};

export type MenuOptionGroup = {
  id: string;
  name: string;
  description?: string | null;

  required: boolean;
  multiple: boolean;

  min_select: number;
  max_select: number;

  order: number;

  items: MenuOptionItem[];
};

export type MenuItem = {
  id: string;
  category_id: string;

  name: string;
  subtitle?: string | null;
  description?: string | null;

  image?: string | null;

  featured: boolean;
  available: boolean;

  order?: number;

  prices: MenuPrice[];

  option_groups: MenuOptionGroup[];
};

export type MenuCategory = {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  order?: number;

  items: MenuItem[];
};