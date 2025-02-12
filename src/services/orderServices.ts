import { Types } from "mongoose";
import Order from "../models/orderModel";
import Cart from "../models/cartModel";
import { IOrder } from "../interface/orderInterface";
import ErrorResponse from "../utils/ApiError";
import { PaymentStatus, OrderStatus } from "../utils/enumsUtil";

class orderServices {
  createOrder = async (
    shippingInfo: any,
    paymentReference: string,
    userId: string | undefined
  ): Promise<IOrder> => {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      throw new ErrorResponse("Cart is empty", 400);
    }

    const order = new Order({
      userId,
      items: cart.items,
      totalAmount: cart.totalPrice, // Use the cart's total price directly
      shippingInfo,
      paymentReference,
      paymentStatus: PaymentStatus.Pending,
      orderStatus: OrderStatus.Processing,
    });

    await order.save();
    await Cart.findOneAndDelete({ userId }); // Clear cart after order is placed

    return order;
  };

  getUserOrders = async (userId: string | undefined): Promise<IOrder[]> => {
    return Order.find({ userId }).sort({ createdAt: -1 });
  };

  getOrderById = async (orderId: string): Promise<IOrder | null> => {
    return Order.findById(orderId).populate("items.productId");
  };

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
