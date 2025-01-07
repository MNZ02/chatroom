import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface decoded {
  username: string;
  userId?: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    res.status(401).json({ message: "Auth token not provided " });
    return;
  }
  try {
    const decoded = jwt.verify(authToken, process.env.SECRET_KEY as string);
    req.user = (decoded as decoded).username;
    next();
  } catch (error) {
    console.error("Error in middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
