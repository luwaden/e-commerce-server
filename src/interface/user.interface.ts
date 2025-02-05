import { model, Schema, Types, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  userName: string;
  isVerified: boolean;
  role: string;
  profileImage: string;
  phoneNumber: string;
}

export interface IMailOptions {
  message: string;
  subject: string;
  email: string;
}
