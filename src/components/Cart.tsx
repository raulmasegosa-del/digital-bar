"use client";

import { useCart } from "@/context/CartContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Cart({
  open,
  onClose,
}: Props) {
  const {
    items,
    total,
    clearCart,
    removeItem,
  } = useCart();

  if (!open) return null;

  return (
    <>
      {/* Fondo */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">
            🛒 Tu pedido
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Productos */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">
              El carrito está vacío.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4"
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </p>

                  {item.options.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-500">
                      {item.options.map(
                        (option, i) => (
                          <li key={i}>
                            • {option.name}
                          </li>
                        )
                      )}
                    </ul>
                  )}

                  <p className="mt-3 font-bold text-amber-600">
                    {(item.price * item.quantity).toFixed(
                      2
                    )}{" "}
                    €
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="border-t p-5">
          <div className="mb-4 flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>
              {total.toFixed(2)} €
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={clearCart}
              className="w-full rounded-lg border py-3 transition hover:bg-gray-100"
            >
              Vaciar carrito
            </button>

            <button
              className="w-full rounded-lg bg-amber-600 py-3 font-semibold text-white transition hover:bg-amber-700"
            >
              Realizar pedido
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}