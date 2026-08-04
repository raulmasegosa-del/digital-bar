import { createClient } from "@supabase/supabase-js";

export const realtime = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function subscribeOrders(
  callback: () => void
) {
  return realtime
    .channel("orders-realtime")
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

export function unsubscribeOrders(
  channel: ReturnType<
    typeof realtime.channel
  >
) {
  realtime.removeChannel(channel);
}