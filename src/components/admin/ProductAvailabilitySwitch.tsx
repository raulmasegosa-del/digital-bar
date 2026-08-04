"use client";

import { useTransition } from "react";

import { toggleProductAvailable } from "@/app/admin/actions";

type Props = {
  id: string;
  available: boolean;
};

export default function ProductAvailabilitySwitch({
  id,
  available,
}: Props) {
  const [pending, startTransition] =
    useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleProductAvailable(
            id,
            !available
          );
        })
      }
      className={`h-7 w-14 rounded-full transition ${
        available
          ? "bg-green-500"
          : "bg-gray-300"
      } ${
        pending
          ? "opacity-50"
          : ""
      }`}
    >
      <div
        className={`h-6 w-6 rounded-full bg-white shadow transition ${
          available
            ? "translate-x-7"
            : "translate-x-0"
        }`}
      />
    </button>
  );
}