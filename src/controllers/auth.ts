import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(401).send("Bad request");
    }
    const token = jwt.sign({ username }, process.env.SECRET_KEY as string, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error loggin in");
    res.status(500).json({ message: "Internal server error" });
  }
};
