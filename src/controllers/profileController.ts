import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import { AuthRequest } from "../middleware/authorization.mw";

// Fetch User Profile
export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
        phoneNumber: user.phoneNumber,
      },
    });
  }
);

// Update User Profile
export const updateUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userName, profileImage, phoneNumber } = req.body;

    const user = await User.findById(req.user);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (userName) user.userName = userName;

    if (profileImage) user.profileImage = profileImage;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      data: {
        _id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  }
);
