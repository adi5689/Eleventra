import { supabase } from "./supabase";
import { createSupabaseApi } from "./supabase-transport";

export const api = createSupabaseApi(supabase);
