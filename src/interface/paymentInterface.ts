import mongoose, { Document, Types } from "mongoose";

import { PaymentStatus } from "../utils/enumsUtil";

// 💰 Payment Interface
export interface Payment extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  transactionId: string;
  paymentReference: string;
  paymentStatus: PaymentStatus;
  amount: number;
  isPaid: boolean;
  paidAt?: Date;
}
