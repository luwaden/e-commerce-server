import { Request, Response, NextFunction, RequestHandler } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  userId?: string | undefined;
  role?: string;
}

interface DecodedToken {
  id: string;
  role: string;
}

const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest; // Explicitly cast req to AuthRequest
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    authReq.userId = decoded.id; // Assign user ID correctly
    authReq.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
