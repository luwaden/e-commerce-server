import mongoose, { Schema, model, Document, CallbackError } from "mongoose";

import { ICart } from "../interface/cartInterface";

const CartSchema: Schema<ICart> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    totalPrice: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
