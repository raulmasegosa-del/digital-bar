"use client";

import { useState } from "react";
import { useCart, CartOption } from "@/context/CartContext";

type Props = {
  open: boolean;
  onClose: () => void;
  item: any;
};

export default function ProductOptionsModal({
  open,
  onClose,
  item,
}: Props) {
  const { addItem } = useCart();

  const [selected, setSelected] = useState<
    Record<string, string>
  >({});

  if (!open) return null;

  function toggleOption(
    groupId: string,
    optionId: string
  ) {
    setSelected((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  }

  function handleAdd() {
    const options: CartOption[] = [];

    item.option_groups?.forEach((group: any) => {
      const selectedId = selected[group.id];

      if (!selectedId) return;

      const option = group.items.find(
        (o: any) => o.id === selectedId
      );

      if (!option) return;

      options.push({
        groupId: group.id,
        groupName: group.name,
        optionId: option.id,
        optionName: option.name,
        extraPrice: Number(option.extra_price ?? 0),
      });
    });

    addItem({
      productId: item.id,
      name: item.name,
      price: Number(item.prices?.[0]?.price ?? 0),
      quantity: 1,
      options,
    });

    setSelected({});
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold">
            {item.name}
          </h2>

          {item.description && (
            <p className="mt-2 text-gray-500">
              {item.description}
            </p>
          )}
        </div>

        <div className="space-y-6 p-6">
          {item.option_groups?.length > 0 ? (
            item.option_groups.map((group: any) => (
              <div key={group.id}>
                <h3 className="mb-3 font-semibold">
                  {group.name}
                </h3>

                <div className="space-y-2">
                  {group.items.map((option: any) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={group.id}
                          checked={
                            selected[group.id] === option.id
                          }
                          onChange={() =>
                            toggleOption(
                              group.id,
                              option.id
                            )
                          }
                        />

                        <span>{option.name}</span>
                      </div>

                      <span className="text-sm text-gray-500">
                        +{Number(option.extra_price).toFixed(2)} €
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              Este producto no tiene opciones.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2 transition hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={handleAdd}
            className="rounded-lg bg-amber-600 px-5 py-2 text-white transition hover:bg-amber-700"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}