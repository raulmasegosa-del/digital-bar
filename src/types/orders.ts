export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export type OrderOption = {
  optionId: string;
  optionName: string;
  extraPrice: number;
};

export type OrderItem = {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  options: OrderOption[];
};

export type Order = {
  id: string;
  table_number: string;
  table: string;
  notes: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items: OrderItem[];
};