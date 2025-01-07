import { getAllUsers } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import express from "express";
const router = express.Router();

router.get("/users", authMiddleware, getAllUsers);

export default router;
