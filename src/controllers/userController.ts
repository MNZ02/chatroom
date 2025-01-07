import { Request, Response } from "express";
import User from "../models/User";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      res.status(404).json({ message: "User not authenticated" });
    }
    const users = await User.find({
      username: {
        $ne: currentUser,
      },
    });
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

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = req.user;
    const currentUser = await User.findOne({ username: user });
    if (!currentUser) {
      res.status(404).json({ message: "User not logged in or not found" });
      return;
    }
    res.status(200).json({ currentUser });
  } catch (error) {
    console.error("Error getting current user", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
