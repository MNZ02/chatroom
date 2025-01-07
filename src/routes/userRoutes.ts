import { getAllUsers } from "../controllers/userController";
import express from "express";
const router = express.Router();

router.get("/users", getAllUsers);

export default router;
