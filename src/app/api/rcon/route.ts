import { NextResponse } from "next/server";
import net from "net";

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
        reject(new Error("RCON connection timed out. Check if server RCON is enabled and port 25575 is open."));
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

export async function POST(req: Request) {
  try {
    const { command, authKey, rconHost, rconPort, rconPassword } = await req.json();

    if (authKey !== "bongcraft_admin_secret_handshake") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!rconHost || !rconPort || !rconPassword) {
      return NextResponse.json({ error: "Missing RCON configuration details" }, { status: 400 });
    }

    // Sanitize command (strip leading slash if present, Minecraft RCON commands shouldn't have leading slash)
    const sanitizedCommand = command.startsWith("/") ? command.substring(1) : command;

    const rcon = new RconClient(rconHost, parseInt(rconPort), rconPassword);
    await rcon.connect();
    const output = await rcon.execute(sanitizedCommand);
    rcon.disconnect();

    return NextResponse.json({ output });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "RCON Connection Refused" }, { status: 500 });
  }
}
