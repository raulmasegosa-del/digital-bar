import { createClient } from "@supabase/supabase-js";

export const realtime = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function subscribeOrders(
  callback: () => void
) {
  return realtime
    .channel("orders")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      callback
    )
    .subscribe();
}