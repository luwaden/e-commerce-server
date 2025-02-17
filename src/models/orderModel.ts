import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interface/orderInterface";
import { OrderStatus, PaymentStatus } from "../utils/enumsUtil";

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // Or String
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      // ... other shipping address fields
    },
    paymentReference: { type: String, required: true, unique: true },
    paymentStatus: { type: String, required: true },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Processing,
      required: true,
    },
  },
  { timestamps: true }
); // Important: Enable timestamps if you want createdAt/updatedAt

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
