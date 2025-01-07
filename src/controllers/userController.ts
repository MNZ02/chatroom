import { Request, Response } from "express";
import User from "../models/User";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find();
    if (users.length == 0) {
      res.status(404).json({ message: "No Users found" });
      return;
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
