import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(401).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({ username, password });
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Error registering", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(401).send("Bad request");
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.password != password) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
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
