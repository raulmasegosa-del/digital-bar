"use client";
import type { MenuItem, MenuOptionGroup, MenuOptionItem } from "@/types/menu";
import { useMemo, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { useCart, CartOption } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import { useToast } from "@/context/ToastContext";

type Props = { open: boolean; onClose: () => void; item: MenuItem };
const CLOSED_MESSAGE = "La sesión ha finalizado. Lee de nuevo el QR de la mesa para continuar.";

export default function ProductOptionsModal({ open, onClose, item }: Props) {
  const { addItem } = useCart();
  const { sessionToken, sessionError } = useTable();
  const { showToast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  if (!open) return null;

  function toggleOption(group: MenuOptionGroup, option: MenuOptionItem) {
    setSelectedOptions((current) => ({ ...current, [group.id]: option.id }));
  }

  const selected: CartOption[] = useMemo(() => {
    return item.option_groups?.flatMap((group: MenuOptionGroup) => {
      const optionId = selectedOptions[group.id];
      if (!optionId) return [];
      const option = group.items.find((o: any) => o.id === optionId);
      if (!option) return [];
      return [{
        groupId: group.id,
        groupName: group.name,
        optionId: option.id,
        optionName: option.name,
        extraPrice: Number(option.extra_price) || 0,
      }];
    }) ?? [];
  }, [item, selectedOptions]);

  const extras = selected.reduce((sum, option) => sum + option.extraPrice, 0);
  const basePrice = Number(item.prices?.[0]?.price ?? 0);
  const total = basePrice + extras;

  function handleAdd() {
    if (!sessionToken) {
      showToast(sessionError || CLOSED_MESSAGE);
      onClose();
      return;
    }

    addItem({ productId: item.id, name: item.name, price: basePrice, quantity: 1, options: selected });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:items-center">
      <div className="flex max-h-[90vh] w-full max-w-xl animate-in slide-in-from-bottom rounded-t-3xl bg-white shadow-2xl md:rounded-3xl">
        <div className="flex w-full flex-col">
          <div className="flex items-start justify-between border-b p-6">
            <div><h2 className="text-2xl font-bold">{item.name}</h2>{item.description && <p className="mt-2 text-gray-500">{item.description}</p>}</div>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100"><X size={20} /></button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto p-6">
            {item.option_groups?.map((group: any) => (
              <div key={group.id}>
                <h3 className="mb-4 text-lg font-bold">{group.name}</h3>
                <div className="space-y-3">
                  {group.items.map((option: MenuOptionItem) => {
                    const checked = selectedOptions[group.id] === option.id;
                    return (
                      <button key={option.id} onClick={() => toggleOption(group, option)} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${checked ? "border-amber-500 bg-amber-50" : "hover:bg-gray-50"}`}>
                        <div><p className="font-semibold">{option.name}</p><p className="text-sm text-gray-500">+ {Number(option.extra_price).toFixed(2)} €</p></div>
                        {checked && <Check className="text-green-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t bg-white p-6">
            <div className="mb-4 flex items-center justify-between"><span className="text-gray-500">Total</span><span className="text-3xl font-bold text-amber-600">{total.toFixed(2)} €</span></div>
            <button onClick={handleAdd} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-4 text-lg font-bold text-white transition hover:bg-amber-700"><Plus size={20} />Añadir al pedido</button>
          </div>
        </div>
      </div>
    </div>
  );
}