import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import net from "net";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = 
  supabaseUrl.startsWith("https://") && 
  supabaseAnonKey.length > 10;

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

class RconClient {
  private socket: net.Socket;
  private host: string;
  private port: number;
  private pass: string;

  constructor(host: string, port: number, pass: string) {
    this.host = host;
    this.port = port;
    this.pass = pass;
    this.socket = new net.Socket();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.socket.destroy();
        reject(new Error("RCON connection timed out. Check if server RCON is enabled and port is open."));
      }, 6000);

      this.socket.connect(this.port, this.host, () => {
        clearTimeout(timeout);
        this.sendPacket(3, this.pass)
          .then(() => resolve())
          .catch(reject);
      });
      
      this.socket.on("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  execute(cmd: string): Promise<string> {
    return this.sendPacket(2, cmd);
  }

  disconnect() {
    this.socket.end();
  }

  private sendPacket(type: number, payload: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const payloadBuf = Buffer.from(payload, "ascii");
      const length = 4 + 4 + payloadBuf.length + 2; 
      const buffer = Buffer.alloc(4 + length);

      buffer.writeInt32LE(length, 0); 
      buffer.writeInt32LE(1234, 4);   
      buffer.writeInt32LE(type, 8);   
      payloadBuf.copy(buffer, 12);     
      buffer.write("\x00\x00", 12 + payloadBuf.length); 

      this.socket.write(buffer);

      this.socket.once("data", (data) => {
        if (data.length < 12) {
          resolve("");
          return;
        }
        const responseLength = data.readInt32LE(0);
        const responseId = data.readInt32LE(4);
        const responseType = data.readInt32LE(8);
        const responsePayload = data.toString("ascii", 12, Math.min(data.length, 12 + responseLength - 10));

        if (type === 3 && responseId === -1) {
          reject(new Error("RCON Authentication Failed: Invalid RCON Password."));
        } else {
          resolve(responsePayload.trim());
        }
      });
    });
  }
}

// Secure Basic Auth Check
function verifyAdmin(authHeader: string | null) {
  if (!authHeader) return false;
  try {
    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, "base64").toString("ascii");
    const [user, pass] = decoded.split(":");
    return user === "admin" && pass === "bongcraftadmin";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // 1. Authenticate Request
  const authHeader = req.headers.get("authorization");
  if (!verifyAdmin(authHeader)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "Missing command parameter" }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    // 2. Load configurations directly from Database (prevents exposing RCON password to client-side requests)
    const { data, error } = await supabase
      .from("store_config")
      .select("value")
      .eq("key", "global_settings")
      .maybeSingle();

    if (error || !data || !data.value || !data.value.rcon) {
      return NextResponse.json({ error: "RCON configuration not found in database" }, { status: 500 });
    }

    const { enabled, host, port, password } = data.value.rcon;

    if (!enabled) {
      return NextResponse.json({ error: "RCON command delivery is disabled" }, { status: 400 });
    }

    if (!host || !port || !password) {
      return NextResponse.json({ error: "Incomplete RCON parameters in database config" }, { status: 500 });
    }

    // Sanitize command (strip leading slash)
    const sanitizedCommand = command.startsWith("/") ? command.substring(1) : command;

    // 3. Connect and execute
    const rcon = new RconClient(host, parseInt(port), password);
    await rcon.connect();
    const output = await rcon.execute(sanitizedCommand);
    rcon.disconnect();

    return NextResponse.json({ output });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "RCON Gateway Failure" }, { status: 500 });
  }
}
