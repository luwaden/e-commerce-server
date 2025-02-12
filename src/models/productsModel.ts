import { Schema, model, Document, CallbackError } from "mongoose";
import { IProduct } from "../interface/productsInterfcae";

const productSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true, unique: true },
    category: { type: String, required: true, unique: false },
    brand: { type: String, required: true, unique: false },
    price: { type: Number, required: true, unique: false },
    countInStock: { type: Number, required: true, unique: false },
    description: { type: String, required: true, unique: false },
    rating: { type: Number, required: true, unique: false },
    numReviews: { type: Number, required: true, unique: false },
  },
  { timestamps: true }
);

const ProductModel = model<IProduct>("Product", productSchema);
export default ProductModel;
