import express, { Router } from "express";

import { userLogin, userRegister, verifyEmail } from "../controllers/auth";
import authMiddleware from "../middleware/authorization.mw";

const authRouter = Router();

authRouter.post("/register", userRegister);

authRouter.post("/signin", userLogin);
authRouter.get("/verify-email/:token", verifyEmail);
export default authRouter;
