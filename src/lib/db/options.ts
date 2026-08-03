import { supabaseAdmin } from "@/lib/supabase/server";
import type {
  OptionGroupInput,
  ActionResult,
} from "@/types/options";

export async function getOptionGroups() {
  const { data, error } = await supabaseAdmin
    .from("option_groups")
    .select("*")
    .order("order");

  if (error) throw error;

  return data ?? [];
}

export async function createOptionGroup(
  group: OptionGroupInput
): Promise<ActionResult> {
  const { data, error } = await supabaseAdmin
    .from("option_groups")
    .insert({
      name: group.name,
      description: group.description,
      required: group.required,
      multiple: group.multiple,
      min_select: group.min_select,
      max_select: group.max_select,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "Error al crear el grupo.",
    };
  }

  if (group.items.length > 0) {
    const rows = group.items.map((item) => ({
      group_id: data.id,
      name: item.name,
      extra_price: item.extra_price,
      available: item.available,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("option_items")
      .insert(rows);

    if (itemsError) {
      return {
        success: false,
        message: itemsError.message,
      };
    }
  }

  return {
    success: true,
    message: "Grupo creado correctamente.",
  };
}