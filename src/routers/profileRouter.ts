import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/profileController";
import authMiddleware from "../middleware/authorization.mw";

const userProfileRouter = Router();

userProfileRouter.get("/profile", authMiddleware, getUserProfile);
userProfileRouter.put("/profile", authMiddleware, updateUserProfile);

export default userProfileRouter;
