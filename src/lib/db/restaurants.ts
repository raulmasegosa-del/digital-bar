import { supabase } from "@/lib/supabase/client";
import { debug } from "@/lib/debug";

export async function getRestaurants() {
  const {
    data,
    error,
  } = await supabase
    .from("restaurants")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  if (process.env.NODE_ENV === "development") {
    debug(
      "🍽 Restaurantes:",
      data?.length ?? 0
    );
  }

  return data ?? [];
}

export async function getRestaurant(
  id: string
) {
  const {
    data,
    error,
  } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createRestaurant(
  restaurant: {
    name: string;
    slug: string;
  }
) {
  const { data, error } =
    await supabase
      .from("restaurants")
      .insert(restaurant)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateRestaurant(
  id: string,
  values: Partial<{
    name: string;
    slug: string;
    active: boolean;
  }>
) {
  const { data, error } =
    await supabase
      .from("restaurants")
      .update(values)
      .eq("id", id)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteRestaurant(
  id: string
) {
  const { error } =
    await supabase
      .from("restaurants")
      .delete()
      .eq("id", id);

  if (error) {
    throw error;
  }
}