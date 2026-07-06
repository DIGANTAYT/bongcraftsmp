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

const defaultFullConfig = {
  maintenanceMode: false,
  discordWebhook: "",
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
  },
  rcon: {
    enabled: false,
    host: "",
    port: 25575,
    password: ""
  },
  tebex: {
    enabled: false,
    publicToken: "",
    privateKey: "",
    packageMappings: {}
  }
};

// Simple secure verification check
function verifyAdmin(authHeader: string | null) {
  if (!authHeader) return false;
  // Format should be: Basic admin:bongcraftadmin (base64 encoded)
  try {
    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, "base64").toString("ascii");
    const [user, pass] = decoded.split(":");
    return user === "admin" && pass === "bongcraftadmin";
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!verifyAdmin(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json(defaultFullConfig);
  }

  try {
    const { data, error } = await supabase
      .from("store_config")
      .select("value")
      .eq("key", "global_settings")
      .maybeSingle();

    if (error || !data) {
      // Table doesn't exist or is empty, return defaults
      return NextResponse.json(defaultFullConfig);
    }

    return NextResponse.json(data.value || defaultFullConfig);
  } catch (e) {
    console.error("Admin GET config error:", e);
    return NextResponse.json(defaultFullConfig);
  }
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!verifyAdmin(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newConfig = await req.json();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
    }

    // Try to update/insert config in database
    const { error } = await supabase
      .from("store_config")
      .upsert({
        key: "global_settings",
        value: newConfig,
        updated_at: new Date().toISOString()
      }, { onConflict: "key" });

    if (error) {
      console.error("Supabase config save error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Admin POST config error:", e);
    return NextResponse.json({ error: e.message || "Failed to save configuration" }, { status: 500 });
  }
}
