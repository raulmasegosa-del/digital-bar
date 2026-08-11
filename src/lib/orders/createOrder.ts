import { createCustomerOrder } from "@/app/actions/createCustomerOrder";
import type { CartItem } from "@/context/CartContext";

type CreateOrderParams = {
  restaurantId: string;
  table: string;
  items: CartItem[];
  notes: string;
  total: number;
};

export async function createOrder(params: CreateOrderParams) {
  return createCustomerOrder(params);
}
