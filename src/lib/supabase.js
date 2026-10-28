import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error("Set the Supabase URL and publishable key in .env.local.");
}

// Keep staff sessions in memory instead of browser storage. Reloading signs out.
export const supabase = createClient(url, publishableKey, {
  auth: { persistSession: false, detectSessionInUrl: false },
});
