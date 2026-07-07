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
    lord: 399,
    paladin: 699,
    duke: 999,
    king: 1499,
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
  },
  salesActive: false,
  salesText: "🔥 Grand Launch Sale: 25% OFF ALL RANKS & COINS!",
  couponCode: "",
  discountPercentage: 0,
  serverIpJava: "play.bongcraftsmp.in",
  serverPortJava: "25565",
  serverIpBedrock: "play.bongcraftsmp.in",
  serverPortBedrock: "19132",
  communityGoalTarget: 10000,
  heroTitle: "BONGCRAFT",
  heroSubtitle: "Bengal's Ultimate Survival Experience",
  heroTagline: "Bangalir Nijer Survival Server",
  discordInvite: "https://discord.gg/WzDAzMYwGX"
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
      prices: value.prices || defaultPublicConfig.prices,
      salesActive: value.salesActive ?? false,
      salesText: value.salesText ?? defaultPublicConfig.salesText,
      couponCode: value.couponCode ?? defaultPublicConfig.couponCode,
      discountPercentage: value.discountPercentage ?? defaultPublicConfig.discountPercentage,
      serverIpJava: value.serverIpJava ?? defaultPublicConfig.serverIpJava,
      serverPortJava: value.serverPortJava ?? defaultPublicConfig.serverPortJava,
      serverIpBedrock: value.serverIpBedrock ?? defaultPublicConfig.serverIpBedrock,
      serverPortBedrock: value.serverPortBedrock ?? defaultPublicConfig.serverPortBedrock,
      communityGoalTarget: value.communityGoalTarget ?? defaultPublicConfig.communityGoalTarget,
      heroTitle: value.heroTitle ?? defaultPublicConfig.heroTitle,
      heroSubtitle: value.heroSubtitle ?? defaultPublicConfig.heroSubtitle,
      heroTagline: value.heroTagline ?? defaultPublicConfig.heroTagline,
      discordInvite: value.discordInvite ?? defaultPublicConfig.discordInvite
    };

    return NextResponse.json(publicConfig);
  } catch (e) {
    console.error("Error in public config API:", e);
    return NextResponse.json(defaultPublicConfig);
  }
}
