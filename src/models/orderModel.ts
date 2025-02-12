import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interface/orderInterface";
import { OrderStatus, PaymentStatus } from "../utils/enumsUtil";
const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    totalPrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus) as string[],
      default: PaymentStatus.Pending,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus) as string[],
      default: OrderStatus.Processing,
    },
    paymentReference: { type: String, unique: true }, // ✅ Add this field
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
