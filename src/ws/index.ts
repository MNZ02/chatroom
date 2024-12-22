import { Server as WebSocketServer } from "ws";
import { handleConnection } from "./handlers";

export function initializeWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", handleConnection);
  console.log("Websocket server initialized");
}
