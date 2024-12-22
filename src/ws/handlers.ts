import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { addUser, removeUser } from "./user";
import dotenv from "dotenv";
import { broadcastToRoom, handleJoinRoom, handleRemoveRoom } from "./rooms";
dotenv.config();

interface decoded {
  username: string;
  password: string;
}

export function handleConnection(
  ws: WebSocket,
  req: any,
  wss: WebSocketServer
) {
  const token = req.headers["sec-websocket-protocol"];
  if (!token) {
    ws.close(1009, "Authentication required");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    const userId = (decoded as decoded).username;
    addUser(userId, ws as any);

    console.log(`${userId} connected`);

    let currentRoom: string | null = null;

    ws.on("message", (data) => {
      try {
        const { type, room, message } = JSON.parse(data.toString());

        if (type === "join_room") {
          if (!room) {
            ws.send(JSON.stringify({ error: "Room name is required" }));
            return;
          }

          if (currentRoom) {
            handleRemoveRoom(currentRoom, userId);
            console.log(`${userId} left room ${currentRoom}`);
          }

          //join new room
          handleJoinRoom(room, userId);
          currentRoom = room;

          console.log(`${userId} joined room ${room}`);
          ws.send(JSON.stringify({ message: `${userId} joined room ${room}` }));
        } else if (type === "message") {
          if (!currentRoom) {
            ws.send(JSON.stringify({ error: "You must join a room " }));
            return;
          }

          broadcastToRoom(wss, currentRoom, message, userId);
        }
      } catch (error) {
        console.error("Failed to process message", error);
        ws.send(JSON.stringify({ error: "Invalid message" }));
      }
    });
    ws.on("close", () => removeUser(userId));
  } catch (error) {
    ws.close(1008, "Invalid token");
  }
}
