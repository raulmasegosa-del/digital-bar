"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import {
  buildWhatsAppMessage,
  openWhatsApp,
} from "@/lib/whatsapp";

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
  increaseQuantity,
  decreaseQuantity,

  notes,
  setNotes,
} = useCart();

const {
  table,
  setTable,
} = useTable();

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

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

              {items.map((item, index) => {

                const extras = item.options.reduce(
                  (sum, option) => sum + option.extraPrice,
                  0
                );

                const subtotal =
                  (item.price + extras) *
                  item.quantity;

                return (
                  <div
                    key={index}
                    className="rounded-xl border p-4 shadow-sm"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="text-lg font-semibold">
                          {item.name}
                        </h3>

                        {item.options.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-gray-500">
                            {item.options.map(
                              (option, i) => (
                                <li key={i}>
                                  • {option.optionName}
                                </li>
                              )
                            )}
                          </ul>
                        )}

                      </div>

                      <button
                        onClick={() =>
                          removeItem(index)
                        }
                        className="text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() =>
                            decreaseQuantity(index)
                          }
                          className="rounded-lg border p-2 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-6 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(index)
                          }
                          className="rounded-lg border p-2 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      <span className="text-lg font-bold text-amber-600">
                        {subtotal.toFixed(2)} €
                      </span>

                    </div>

                  </div>
                );
              })}

              {/* Mesa */}

              <div>

                <label className="mb-2 block font-semibold">
                  Mesa
                </label>

                <input
                  type="text"
                  value={table}
                  onChange={(e) =>
                    setTable(e.target.value)
                  }
                  placeholder="Ej. 12"
                  className="w-full rounded-xl border p-3"
                />

              </div>

              {/* Observaciones */}

              <div>

                <label className="mb-2 block font-semibold">
                  Observaciones
                </label>

                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Sin cebolla, muy hecho..."
                  className="w-full rounded-xl border p-3"
                />

              </div>

            </div>
          )}

        </div>

        {/* Pie */}

        <div className="border-t p-5">

          <div className="mb-5 flex items-center justify-between">

            <span className="text-xl font-bold">
              Total
            </span>

            <span className="text-3xl font-bold text-amber-600">
              {total.toFixed(2)} €
            </span>

          </div>

          <div className="space-y-3">

            <button
              onClick={clearCart}
              className="w-full rounded-xl border py-3 hover:bg-gray-100"
            >
              Vaciar carrito
            </button>

        <button
  onClick={() => {
    if (items.length === 0) return;

    const message = buildWhatsAppMessage({
  items,
  tableNumber: table,
  notes,
  total,
});

    openWhatsApp(
      "34689292148",
      message
    );
  }}
  className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
>
  Enviar pedido por WhatsApp
</button>

          </div>

        </div>

      </aside>
    </>
  );
}