"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOptionGroup(
  formData: FormData
) {
  const name = (
    formData.get("name") as string
  )?.trim();

  const description = (
    formData.get("description") as string
  )?.trim() || null;

  const restaurantId = formData.get(
    "restaurant_id"
  ) as string;

  const slug = (
    formData.get("slug") as string
  )?.trim();

  const required =
    formData.get("required") === "on";

  const multiple =
    formData.get("multiple") === "on";

  const minSelect = Number(
    formData.get("min_select")
  );

  const maxSelect = Number(
    formData.get("max_select")
  );

  const order = Number(
    formData.get("order")
  );

  if (!restaurantId) {
    throw new Error(
      "Restaurante no encontrado."
    );
  }

  if (!name) {
    throw new Error(
      "El nombre es obligatorio."
    );
  }

  if (
    Number.isNaN(minSelect) ||
    minSelect < 0
  ) {
    throw new Error(
      "El mínimo no es válido."
    );
  }

  if (
    Number.isNaN(maxSelect) ||
    maxSelect < 1
  ) {
    throw new Error(
      "El máximo no es válido."
    );
  }

  if (minSelect > maxSelect) {
    throw new Error(
      "El mínimo no puede ser mayor que el máximo."
    );
  }

  const { error } = await supabaseAdmin
    .from("option_groups")
    .insert({
      restaurant_id: restaurantId,
      name,
      description,
      required,
      multiple,
      min_select: minSelect,
      max_select: maxSelect,
      order: Number.isNaN(order) ? 0 : order,
    });

  if (error) {
    throw error;
  }

  revalidatePath(
    `/admin/${slug}/options`
  );

  redirect(`/admin/${slug}/options`);
}

export async function updateOptionGroup(
  formData: FormData
) {
  const id = formData.get("id") as string;

  const name = (
    formData.get("name") as string
  )?.trim();

  const description = (
    formData.get("description") as string
  )?.trim() || null;

  const restaurantId = formData.get(
    "restaurant_id"
  ) as string;

  const slug = (
    formData.get("slug") as string
  )?.trim();

  const required =
    formData.get("required") === "on";

  const multiple =
    formData.get("multiple") === "on";

  const minSelect = Number(
    formData.get("min_select")
  );

  const maxSelect = Number(
    formData.get("max_select")
  );

  const order = Number(
    formData.get("order")
  );

  if (!id) {
    throw new Error(
      "Grupo de opciones no encontrado."
    );
  }

  if (!restaurantId) {
    throw new Error(
      "Restaurante no encontrado."
    );
  }

  if (!name) {
    throw new Error(
      "El nombre es obligatorio."
    );
  }

  if (
    Number.isNaN(minSelect) ||
    minSelect < 0
  ) {
    throw new Error(
      "El mínimo no es válido."
    );
  }

  if (
    Number.isNaN(maxSelect) ||
    maxSelect < 1
  ) {
    throw new Error(
      "El máximo no es válido."
    );
  }

  if (minSelect > maxSelect) {
    throw new Error(
      "El mínimo no puede ser mayor que el máximo."
    );
  }

  const { error } = await supabaseAdmin
    .from("option_groups")
    .update({
      name,
      description,
      required,
      multiple,
      min_select: minSelect,
      max_select: maxSelect,
      order: Number.isNaN(order) ? 0 : order,
    })
    .eq("id", id)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw error;
  }

  revalidatePath(
    `/admin/${slug}/options`
  );

  redirect(`/admin/${slug}/options`);
}