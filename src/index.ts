import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();

const app = express();
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

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(message.toString());

    broadcast(message.toString());
  });

  function broadcast(msg: any) {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  }
});
server.listen(PORT, () => {
  console.log(`Server is running on ws://localhost:${PORT}`);
});
