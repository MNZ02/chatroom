import express from "express";
import authRoutes from "./routes/authRoutes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);

app.use("/api", authRoutes);

export default app;
