import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import { IUser } from "../interface/user.interface";
import asyncHandler from "express-async-handler";
import sendMail from "../utils/sendEmail";
import { Error } from "mongoose";
import { log } from "console";

export interface RegisterRequestBody {
  email: string;
  password: string;
  userName: string;
}

export const userRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, userName } = req.body;
    console.log(req.body);

    if (!email || !password || !userName) {
      res.status(400).json({
        status: "400",
        error: "Bad request",
        message: "email, password, and username are required",
      });
      return;
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        error: true,
        message:
          "A user with this email already exists. Please log in or use a different email.",
      });
      return;
    }
 
    // Create the new user
    const newUser = new User({
      email,
      password,
      userName,
    });
    if (!newUser) {
      throw new Error("unable to register user");
    }

    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.VERFIFY_EMAIL_JWT_EXPIRES,
      }
    );
  

    const message = `Click on the link below to verify your email:  \n http://localhost:3000/api/v1/users/verify?token=${token}`;

    await newUser.save();
    await sendMail({
      email: newUser.email,
      subject: "Email verification",
      message,
    });

    res.status(201).json({
      message: "A new user successfully created",
      data: { email, userName },
    });
  }
);

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check for the JWT_SECRET environment variable
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    res.status(500).json({ error: true, message: "JWT_SECRET is not defined" });
    return;
  }

  // Find user by email
  const user: IUser | null = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ error: true, message: "Invalid password or email" });
    return;
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ error: true, message: "Invalid password or email" });
    return;
  }

  // Generate a JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
  console.log(token);
  

  // Respond with success
  res.status(200).json({
    error: false,
    data: token,
    message: "Login successful",
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = req.params.token;

  if (!token) {
    res.status(400).json({ error: true, message: "Token is required" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ error: true, message: "JWT_SECRET is not defined" });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  const email = decoded.email;

  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  );

  if (!user) {
    res.status(404).json({ error: true, message: "User not found" });
    return;
  }

  res.status(200).json({
    error: false,
    data: user,
    message: "Email verification successful",
  });
});
