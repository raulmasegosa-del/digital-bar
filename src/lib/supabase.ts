import { createClient } from "@supabase/supabase-js";

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "ANON KEY:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)
);

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);