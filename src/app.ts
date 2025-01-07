import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);

app.use("/api", authRoutes);
app.use("/api", userRoutes);

export default app;
