"use server";

import { revalidatePath } from "next/cache";
import { createOptionGroup } from "@/lib/db/options";
import { OptionGroupInput } from "@/types/option";

export async function createOptionGroupAction(
  data: OptionGroupInput
) {
  const result = await createOptionGroup(data);

  if (result.success) {
    revalidatePath("/admin/options");
  }

  return result;
}