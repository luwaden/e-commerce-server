import { Document, Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  amount: number;
}
