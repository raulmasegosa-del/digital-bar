"use client";

import { useMemo, useState } from "react";
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

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  if (!open) return null;

  function toggleOption(
    group: any,
    option: any
  ) {
    setSelectedOptions((current) => ({
      ...current,
      [group.id]: option.id,
    }));
  }

  const selected: CartOption[] = useMemo(() => {
    return (
      item.option_groups?.flatMap((group: any) => {
        const optionId = selectedOptions[group.id];

        if (!optionId) {
          return [];
        }

        const option = group.items.find(
          (o: any) => o.id === optionId
        );

        if (!option) {
          return [];
        }

        return [
          {
            groupId: group.id,
            groupName: group.name,
            optionId: option.id,
            optionName: option.name,
            extraPrice:
              Number(option.extra_price) || 0,
          },
        ];
      }) ?? []
    );
  }, [item, selectedOptions]);

  const extras = selected.reduce(
    (sum, option) => sum + option.extraPrice,
    0
  );

  const basePrice = Number(
    item.prices?.[0]?.price ?? 0
  );

  const total = basePrice + extras;

  function handleAdd() {
    addItem({
      productId: item.id,
      name: item.name,
      price: basePrice,
      quantity: 1,
      options: selected,
    });

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
                  {group.items.map((option: any) => {
                    const checked =
                      selectedOptions[group.id] ===
                      option.id;

                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${
                          checked
                            ? "border-amber-500 bg-amber-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={group.id}
                            checked={checked}
                            onChange={() =>
                              toggleOption(
                                group,
                                option
                              )
                            }
                          />

                          <span>
                            {option.name}
                          </span>
                        </div>

                        <span className="text-sm text-gray-500">
                          +{Number(
                            option.extra_price
                          ).toFixed(2)} €
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              Este producto no tiene opciones.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t p-6">
          <div>
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="text-2xl font-bold text-amber-600">
              {total.toFixed(2)} €
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancelar
            </button>

            <button
              onClick={handleAdd}
              className="rounded-lg bg-amber-600 px-5 py-2 text-white hover:bg-amber-700"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}