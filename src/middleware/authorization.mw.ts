import { Request, Response, NextFunction, RequestHandler } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: string;
  role?: string;
}
interface DecodedToken {
  id: string;
  role: string;
}

// Define the middleware as RequestHandler with void return type
const authMiddleware: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
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
    req.user = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
