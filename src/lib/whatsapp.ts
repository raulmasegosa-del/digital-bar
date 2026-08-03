import { CartItem } from "@/context/CartContext";

export function buildWhatsAppMessage({
  items,
  tableNumber,
  notes,
  total,
}: {
  items: CartItem[];
  tableNumber: string;
  notes: string;
  total: number;
}) {
  let message = "🍽️ *NUEVO PEDIDO*\n\n";

  if (tableNumber.trim()) {
    message += `🪑 *Mesa:* ${tableNumber}\n\n`;
  }

  items.forEach((item) => {
    message += `*${item.quantity} × ${item.name}*\n`;

    item.options.forEach((option) => {
      message += `   • ${option.optionName}\n`;
    });

    message += "\n";
  });

  if (notes.trim()) {
    message += "📝 *Observaciones*\n";
    message += `${notes}\n\n`;
  }

  message += `💶 *TOTAL:* ${total.toFixed(2)} €`;

  return message;
}

export function openWhatsApp(
  phone: string,
  message: string
) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
}