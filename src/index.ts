import { createServer } from "http";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import app from "./app";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

interface decoded {
  username: string;
  password: string;
}

const PORT = process.env.PORT || 8080;

const server = createServer(app);

const wss = new WebSocketServer({ server });

//   .connect(process.env.DB_URI as string)
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   .catch((err) => console.log(err));

// wss.on("connection", (ws) => {
//   ws.on("connection", () => {
//     console.log("Client connected");
//   });

//   ws.on("message", (message) => {
//     if (message.toString() === "ping") {
//       console.log("pong");
//     } else if (message.toString() === "pong") {
//       console.log("ping");
//     }
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });
//create a map to store user connections
const userConnections = new Map<
  string,
  { socket: WebSocket; room: string | null }
>();
const rooms = new Map<string, Set<string>>();

function broadcastToRoom(room: string, message: string, senderId: string) {
  const participants = rooms.get(room);
  if (!participants) return;

  for (const participantId of participants) {
    if (participantId === senderId) continue;
    const client = Array.from(wss.clients).find(
      (ws) => (ws as any).id === participantId
    );

    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ sender: senderId, message }));
    }
  }
}
wss.on("connection", (ws, req) => {
  const token = req.headers["sec-websocket-protocol"];

  if (!token) {
    ws.close(1008, "Authentication required");
    return;
  }

  // function broadcast(msg: any) {
  //   for (const client of wss.clients) {
  //     if (client.readyState === WebSocket.OPEN) {
  //       client.send(msg);
  //     }
  //   }
  // }

  const userId = uuidv4();
  (ws as any).id = userId;
  console.log("Assigned id " + (ws as any).id);

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

    console.log("Authenticated user", decoded);

    (ws as any).user = decoded;

    userConnections.set((decoded as decoded).username, {
      socket: ws,
      room: null,
    });

    ws.on("message", (data) => {
      console.log(`${(decoded as decoded).username}: ${data}`);
      try {
        const { type, room, message, recepient } = JSON.parse(data.toString());

        const userId = (ws as any).id;
        if (type === "join_room") {
          if (!rooms.has(room)) {
            rooms.set(room, new Set());
          }
          rooms.get(room)?.add(userId);
          userConnections.get((decoded as decoded).username)!.room = room;

          console.log(`${userId} joined room ${room}`);
          return;
        }
        if (!recepient || !message) {
          ws.send(
            JSON.stringify({ error: "Recipient and message are required." })
          );
          console.log(
            "Invalid message format. Must include recipient and message."
          );
          return;
        }

        if (type === "message") {
          const senderRoom = userConnections.get(
            (decoded as decoded).username
          )?.room;

          if (!senderRoom || senderRoom !== room) {
            ws.send(JSON.stringify({ error: "You must join a room" }));
            return;
          }
          if (!recepient) {
            broadcastToRoom(room, message, userId);
          } else {
            const recipientConnection = userConnections.get(recepient);
            if (!recipientConnection) {
              ws.send(JSON.stringify({ error: "Recipient not found" }));
              return;
            }

            const recipientSocket = recipientConnection.socket;
            if (recipientSocket.readyState === WebSocket.OPEN) {
              recipientSocket.send(
                JSON.stringify({
                  sender: (decoded as decoded).username,
                  message,
                })
              );
            }
          }
        }
        const recipientConnection = userConnections.get(recepient);
        if (!recipientConnection) {
          ws.send(JSON.stringify({ error: "Recipient not found." }));
          return;
        }

        const recipientSocket = recipientConnection.socket;

        if (recipientSocket.readyState === WebSocket.OPEN) {
          recipientSocket.send(
            JSON.stringify({ sender: (decoded as decoded).username, message })
          );
          broadcastToRoom(room, message, userId);
        }
      } catch (error) {
        console.error("Failed to process message", error);
        ws.send(JSON.stringify({ error: "Invalid message format." }));
      }

      // broadcast(message.toString());
    });

    ws.on("close", () => {
      const username = (decoded as decoded).username;
      const user = userConnections.get(username);
      if (user?.room) {
        rooms.get(user.room)?.delete(userId);
        console.log("Recepient left room");
      }
      userConnections.delete(username);
    });
  } catch (error) {
    ws.close(1008, "Invalid token");
  }
});

app.listen(PORT, () => {
  console.log("Http server running on http://localhost:" + PORT);
});
server.listen(8080, () => {
  console.log(`WSS is running on ws://localhost:${8080}`);
});
