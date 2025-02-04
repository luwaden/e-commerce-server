import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";
import Product from "../models/productsModel";
import { PaymentStatus, OrderStatus } from "../utils/enumsUtil";

export const createOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId, items, shippingAddress } = req.body;

    // Validate input
    if (!userId || !items || items.length === 0 || !shippingAddress) {
      res.status(400).json({
        error: true,
        message: "User ID, items, and shipping address are required.",
      });
      return;
    }

    // Validate items
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404).json({
          error: true,
          message: `Product not found: ${item.productId}`,
        });
        return;
      }

      if (product.countInStock < item.quantity) {
        res.status(400).json({
          error: true,
          message: `Insufficient stock for product: ${product.name}`,
        });
        return;
      }

      // Add to total price
      totalPrice += product.price * item.quantity;

      // Deduct stock
      product.countInStock -= item.quantity;
      await product.save();
    }

    // Create the order
    const order = new Order({
      userId,
      items: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      paymentStatus: PaymentStatus.Pending,
      orderStatus: OrderStatus.Processing,
      totalPrice,
    });

    await order.save();

    res.status(201).json({
      error: false,
      message: "Order created successfully",
      data: order,
    });
  }
);

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.json(order);
  }
);

export const updateOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus, shippingAddress } = req.body;

    // Validate input
    if (!orderId) {
      res.status(400).json({
        error: true,
        message: "Order ID is required",
      });
      return;
    }

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        error: true,
        message: "Order not found",
      });
      return;
    }

    // Update allowed fields
    if (orderStatus && Object.values(OrderStatus).includes(orderStatus)) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus && Object.values(PaymentStatus).includes(paymentStatus)) {
      order.paymentStatus = paymentStatus;
    }

    if (shippingAddress) {
      order.shippingAddress = {
        ...order.shippingAddress,
        ...shippingAddress, // Only update provided fields in the shipping address
      };
    }

    // Save the updated order
    const updatedOrder = await order.save();

    res.status(200).json({
      error: false,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  }
);

export const deleteOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const { user } = req.body; // Assuming authentication middleware attaches `user` to the request

    // Validate input
    if (!orderId) {
      res.status(400).json({
        error: true,
        message: "Order ID is required",
      });
      return;
    }

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        error: true,
        message: "Order not found",
      });
      return;
    }

    // Check if the user is authorized to delete the order
    if (user.role !== "admin") {
      // If the user is not an admin, ensure they own the order
      if (order.userId.toString() !== user._id.toString()) {
        res.status(403).json({
          error: true,
          message: "You are not authorized to delete this order",
        });
        return;
      }

      // Restrict deletion based on order status
      if (
        order.orderStatus === "Shipped" ||
        order.orderStatus === "Delivered"
      ) {
        res.status(400).json({
          error: true,
          message: "Cannot delete an order that has been shipped or delivered",
        });
        return;
      }
    }

    // Admin or authorized user can delete the order
    await order.deleteOne();

    res.status(200).json({
      error: false,
      message: "Order deleted successfully",
    });
  }
);
