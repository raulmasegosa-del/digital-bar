"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createRestaurantRecord } from "@/lib/db/restaurants/createRestaurantRecord";
import { createRestaurantSettings } from "@/lib/db/restaurants/createRestaurantSettings";

export async function createRestaurant(
  formData: FormData
) {
  const name = (formData.get("name") as string)?.trim();

  const slug = (formData.get("slug") as string)?.trim();

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  if (!slug) {
    throw new Error("El slug es obligatorio.");
  }

  // 1. Crear restaurante
  const restaurant = await createRestaurantRecord(
    name,
    slug
  );

  // 2. Crear configuración inicial
  await createRestaurantSettings(
    restaurant.id,
    name
  );

  // 3. Próximamente
  // await createRestaurantTables(
  //   restaurant.id,
  //   Number(formData.get("tables"))
  // );

  // 4. Próximamente
  // await initializeRestaurant(
  //   restaurant.id
  // );

  revalidatePath("/super/restaurants");

  redirect("/super/restaurants");
}