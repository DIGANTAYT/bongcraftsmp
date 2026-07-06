import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = 
  supabaseUrl.startsWith("https://") && 
  supabaseAnonKey.length > 10;

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase URL or Anon Key is missing. Store is running in Local Fallback mode."
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

// Force rebuild trigger to load Vercel environment variables

