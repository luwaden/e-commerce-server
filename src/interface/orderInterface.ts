import { Document, Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  paymentStatus: string;
  orderStatus: string;
  totalPrice: number;
}
