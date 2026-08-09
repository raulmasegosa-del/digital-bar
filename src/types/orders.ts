export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "bill"
  | "completed"
  | "cancelled";

export type ActiveOrderStatus = Exclude<
  OrderStatus,
  "completed" | "cancelled"
>;

export type TableStatus =
  | "free"
  | ActiveOrderStatus;

export type TableItem = {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string | null;
  options?: unknown;
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
  createdAt: string;
  orderId: string;
};

export type OrderOption = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  extraPrice: number;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  options: OrderOption[];
};

export type Order = {
  id: string;
  table: string;
  table_number: string;
  status: OrderStatus;
  notes: string;
  total: number;
  created_at: string;
  updated_at?: string;
  order_items: OrderItem[];
};