import { createServer } from "http";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import app from "./app";
import jwt, { JwtPayload } from "jsonwebtoken";

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

wss.on("connection", (ws, req) => {
  const token = req.headers["sec-websocket-protocol"];

  if (!token) {
    ws.close(1008, "Authentication required");
    return;
  }

  function broadcast(msg: any) {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

    console.log("Authenticated user", decoded);

    (ws as any).user = decoded;

    ws.on("message", (message) => {
      console.log(`${(decoded as decoded).username}: ${message}`);

      broadcast(message.toString());
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
