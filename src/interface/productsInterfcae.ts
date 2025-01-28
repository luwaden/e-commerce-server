import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  userId: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  name: string;
  slug: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  countInStock: number;
  description: string;
  rating: number;
  numReviews: number;
}
