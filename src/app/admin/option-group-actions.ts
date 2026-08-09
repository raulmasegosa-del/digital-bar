"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOptionGroup(
  formData: FormData
) {
  const restaurant_id = formData.get(
    "restaurant_id"
  ) as string;

  const slug = formData.get(
    "slug"
  ) as string;

  const name = (
    formData.get("name") as string
  )?.trim();

  const description = (
    formData.get("description") as string
  )?.trim();

  const required =
    formData.get("required") === "on";

  const multiple =
    formData.get("multiple") === "on";

  const min_select = Number(
    formData.get("min_select") ?? 0
  );

  const max_select = Number(
    formData.get("max_select") ?? 1
  );

  const order = Number(
    formData.get("order") ?? 0
  );

  if (!name) {
    throw new Error(
      "El nombre es obligatorio."
    );
  }

  const { error } = await supabaseAdmin
    .from("option_groups")
    .insert({
      restaurant_id,
      name,
      description,
      required,
      multiple,
      min_select,
      max_select,
      order,
    });

  if (error) {
    throw error;
  }

  revalidatePath(
    `/admin/${slug}/options`
  );

  redirect(
    `/admin/${slug}/options`
  );
}

export async function updateOptionGroup(
  formData: FormData
) {
  const id = formData.get("id") as string;

  const slug = formData.get(
    "slug"
  ) as string;

  const name = (
    formData.get("name") as string
  )?.trim();

  const description = (
    formData.get("description") as string
  )?.trim();

  const required =
    formData.get("required") === "on";

  const multiple =
    formData.get("multiple") === "on";

  const min_select = Number(
    formData.get("min_select") ?? 0
  );

  const max_select = Number(
    formData.get("max_select") ?? 1
  );

  const order = Number(
    formData.get("order") ?? 0
  );

  if (!id) {
    throw new Error(
      "Grupo no encontrado."
    );
  }

  if (!name) {
    throw new Error(
      "El nombre es obligatorio."
    );
  }

  const { error } = await supabaseAdmin
    .from("option_groups")
    .update({
      name,
      description,
      required,
      multiple,
      min_select,
      max_select,
      order,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath(
    `/admin/${slug}/options`
  );

  redirect(
    `/admin/${slug}/options`
  );
}

export async function deleteOptionGroup(
  id: string,
  slug: string
) {
  const { error } = await supabaseAdmin
    .from("option_groups")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath(
    `/admin/${slug}/options`
  );

  return {
    success: true,
  };
}