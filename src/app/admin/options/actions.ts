"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export interface CreateOptionGroupData {
  name: string;
  description?: string;
  required: boolean;
  multiple: boolean;
  min_select: number;
  max_select: number;

  items: {
    name: string;
    extra_price: number;
    available: boolean;
  }[];
}

export async function createOptionGroup(
  data: CreateOptionGroupData
) {
  // Crear grupo

  const { data: group, error } = await supabaseAdmin
    .from("option_groups")
    .insert({
      name: data.name,
      description: data.description,
      required: data.required,
      multiple: data.multiple,
      min_select: data.min_select,
      max_select: data.max_select,
    })
    .select()
    .single();

  if (error) throw error;

  // Crear opciones

  if (data.items.length) {
    const rows = data.items.map((item, index) => ({
      group_id: group.id,
      name: item.name,
      extra_price: item.extra_price,
      available: item.available,
      order: index,
    }));

    const { error: itemError } = await supabaseAdmin
      .from("option_items")
      .insert(rows);

    if (itemError) throw itemError;
  }

  revalidatePath("/admin/options");

  return {
    success: true,
  };
}