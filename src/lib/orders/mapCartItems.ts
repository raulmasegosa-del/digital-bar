import type { CartItem } from "@/context/CartContext";

export function mapCartItems(
  orderId: string,
  items: CartItem[]
) {
  return items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    options: item.options,
  }));
}