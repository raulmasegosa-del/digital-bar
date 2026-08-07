import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({
  path: ".env.local",
});

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error(
    "❌ NEXT_PUBLIC_SUPABASE_URL no encontrada"
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "❌ SUPABASE_SERVICE_ROLE_KEY no encontrada"
  );
}

console.log("🔗 Supabase:", url);

console.log(
  "🔑 Service Role:",
  serviceRoleKey.slice(0, 20) + "..."
);

export const supabaseAdmin = createClient(
  url,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);