"use server";

import { revalidatePath } from "next/cache";
import { updateRestaurantSettings } from "@/lib/db/settings";
import type { RestaurantSettingsInput } from "@/types/settings";

export async function saveRestaurantSettings(
  formData: FormData
) {
  const values: RestaurantSettingsInput = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
    logo: String(formData.get("logo") ?? ""),
    primary_color: String(
      formData.get("primary_color") ?? "#d97706"
    ),
    accept_orders: formData.get("accept_orders") === "on",
  };

  await updateRestaurantSettings(values);

  revalidatePath("/admin/settings");
}