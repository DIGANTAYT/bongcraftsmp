import { NextResponse } from "next/server";
import { executeRcon } from "@/lib/rcon";

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

    // 2. Execute RCON command using shared utility
    const output = await executeRcon(command);

    return NextResponse.json({ output });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "RCON Gateway Failure" }, { status: 500 });
  }
}
