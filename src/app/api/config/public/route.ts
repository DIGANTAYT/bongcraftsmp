import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = 
  supabaseUrl.startsWith("https://") && 
  supabaseAnonKey.length > 10;

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Default fallbacks if Supabase table is not created yet or fails
const defaultPublicConfig = {
  maintenanceMode: false,
  prices: {
    knight: 99,
    lord: 199,
    paladin: 299,
    duke: 499,
    king: 999,
    crate_common: 49,
    crate_rare: 99,
    crate_epic: 199,
    crate_legendary: 399,
    coins_500: 49,
    coins_1200: 99,
    coins_2500: 199,
    coins_6000: 399,
    coins_12000: 699,
    coins500: 49,
    coins1200: 99,
    coins2500: 199,
    coins6000: 399,
    coins12000: 699
  }
};

export async function GET() {
  if (!supabase) {
    return NextResponse.json(defaultPublicConfig);
  }

  try {
    const { data, error } = await supabase
      .from("store_config")
      .select("value")
      .eq("key", "global_settings")
      .maybeSingle();

    if (error || !data) {
      console.warn("Could not load config from Supabase:", error);
      return NextResponse.json(defaultPublicConfig);
    }

    const value = data.value || {};
    
    // Filter out private keys/sensitive values to prevent exposing them to normal users
    const publicConfig = {
      maintenanceMode: value.maintenanceMode ?? false,
      prices: value.prices || defaultPublicConfig.prices
    };

    return NextResponse.json(publicConfig);
  } catch (e) {
    console.error("Error in public config API:", e);
    return NextResponse.json(defaultPublicConfig);
  }
}
