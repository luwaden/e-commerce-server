import express, { Router, Request, Response, NextFunction } from "express";
import User from "../models/userModel";

import { userLogin, userRegister, verifyEmail } from "../controllers/auth";
import authMiddleware from "../middleware/authorization.mw";

const authRouter = Router();

interface LoginRequestBody {
  email: string;
  password: string;
}

authRouter.post("/register", userRegister);

authRouter.post("/signin", userLogin);
authRouter.get("/verify-email/:token", verifyEmail);
export default authRouter;
