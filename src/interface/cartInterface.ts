import { Document, Types } from "mongoose";

export interface ICartItem {
  price: number;
  _id?: any;
  productId: Types.ObjectId;
  quantity: number;
}
export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}
