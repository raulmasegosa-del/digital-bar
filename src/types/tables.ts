export type TableStatus =
  | "free"
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "bill";

export type TableItem = {
  id: string;
  quantity: number;
  unit_price: number;
  notes?: string | null;

  menu_items?: {
    name: string;
  };
};

export type TableOrder = {
  id: string;
  table_number: string;
  status: TableStatus;
  total: number;
  created_at: string;

  order_items: TableItem[];
};

export type TableInfo = {
  number: string;
  status: TableStatus;
  total: number;
  items: number;
  createdAt?: string;
  orderId?: string;
};