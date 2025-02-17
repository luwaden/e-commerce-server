import mongoose from "mongoose";
import Order from "../models/orderModel";
import Cart from "../models/cartModel";
import { IOrder } from "../interface/orderInterface";
import ErrorResponse from "../utils/ApiError";
import { PaymentStatus, OrderStatus } from "../utils/enumsUtil";
import crypto from "crypto";

class orderServices {
  createOrder = async (
    userId: string | undefined,
    shippingAddress: any
  ): Promise<IOrder> => {
    if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
      throw new ErrorResponse("Invalid userId format", 400);
    }
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    console.log("cart:", cart);

    if (!cart || cart.items.length === 0) {
      throw new ErrorResponse("Cart is empty", 400);
    }

    // Generate a unique payment reference
    const paymentReference = `PAYREF-${Date.now()}-${crypto
      .randomBytes(8)
      .toString("hex")}`;

    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice, // Use the cart's total price directly
      shippingAddress: shippingAddress,
      paymentReference: `PAYREF-${Date.now()}-${crypto
        .randomBytes(8)
        .toString("hex")}`, // Automatically generated reference
      paymentStatus: PaymentStatus.Pending,
      orderStatus: OrderStatus.Processing,
    });

    await order.save();
    await Cart.findOneAndDelete({ userId }); // Clear cart after order is placed

    return order;
  };

  async getUserOrders(userId: string | undefined) {
    if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
      throw new ErrorResponse("Unauthorized", 401);
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      throw new ErrorResponse("No orders found for this user", 400);
    }

    return orders;
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ErrorResponse("Invalid orderId format", 400);
    }

    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      throw new ErrorResponse("Order not found", 404);
    }

    return order;
  }

  updateOrderPaymentStatus = async (
    reference: string,
    status: PaymentStatus
  ): Promise<IOrder | null> => {
    const order = await Order.findOneAndUpdate(
      { paymentReference: reference },
      { paymentStatus: status },
      { new: true }
    );

    if (!order) {
      throw new ErrorResponse(
        "Order not found for this payment reference",
        404
      );
    }

    return order;
  };

  updateOrderStatus = async (
    orderId: string,
    status: OrderStatus
  ): Promise<IOrder | null> => {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new ErrorResponse("Invalid order status", 400);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      throw new ErrorResponse("Order not found", 404);
    }

    return order;
  };
}

export const OrderServices = new orderServices();
