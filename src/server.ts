import { createServer } from "http";
import mongoose from "mongoose";
import app from "./app";
import { initializeWebSocket } from "./ws";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer(app);

initializeWebSocket(server);

mongoose
  .connect(process.env.DB_URI as string)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Http server running on http://localhost:" + PORT);
});
server.listen(8080, () => {
  console.log(`WSS is running on ws://localhost:${8080}`);
});
