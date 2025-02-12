import mongoose, { Schema, Document } from "mongoose";
import { PaymentStatus } from "../utils/enumsUtil";
import { Payment } from "../interface/paymentInterface";

const PaymentSchema = new Schema<Payment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentReference: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    amount: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model<Payment>("Payment", PaymentSchema);
export default Payment;
