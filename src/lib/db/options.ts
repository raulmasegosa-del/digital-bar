import { supabaseAdmin } from "@/lib/supabase/admin";
import { OptionGroupInput } from "@/types/option";

export async function createOptionGroup(
  group: OptionGroupInput
) {
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

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (group.items.length > 0) {
    const rows = group.items.map((item, index) => ({
      group_id: data.id,
      name: item.name,
      extra_price: item.extra_price,
      available: item.available,
      order: index,
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