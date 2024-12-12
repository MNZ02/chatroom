import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const server = createServer(app);

const wss = new WebSocketServer({ server });

// mongoose
//   .connect(process.env.DB_URI as string)
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   .catch((err) => console.log(err));

wss.on("connection", (ws) => {
  wss.on("connection", () => {
    console.log("Client connected");
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ws://localhost:${PORT}`);
});
