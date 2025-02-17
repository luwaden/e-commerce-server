import mongoose, { Document, Types } from "mongoose";
import { OrderStatus, PaymentStatus } from "../utils/enumsUtil";

export interface IOrderItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrder {
  _id?: string;
  userId: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentReference: String;

  updatedAt: Date;
}
