import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { OrderServices } from "../services/orderServices";
import { AuthRequest } from "../middleware/authorization.mw";
import { PaymentStatus, OrderStatus } from "../utils/enumsUtil";

class orderController {
  createOrder = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const authReq = req as AuthRequest;
      const userId = authReq.userId;

      const { shippingAddress } = req.body;

      const order = await OrderServices.createOrder(userId, shippingAddress);

      res.status(201).json({
        message: "Order created successfully",
        data: order,
        error: false,
      });
    }
  );

  getUserOrders = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const authReq = req as AuthRequest;
      const userId = authReq.userId;

      const orders = await OrderServices.getUserOrders(userId);

      res.status(200).json({
        message: "User orders retrieved successfully",
        data: orders,
        error: false,
      });
    }
  );

  getOrderById = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const authReq = req as AuthRequest;
      const userId = authReq.userId;

      const { orderId } = req.params;
      const order = await OrderServices.getOrderById(orderId);

      if (!order) {
        res.status(404).json({
          message: "Order not found",
          error: true,
        });
        return;
      }

      res.status(200).json({
        message: "Order retrieved successfully",
        data: order,
        error: false,
      });
    }
  );

  updateOrderPaymentStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { reference } = req.params;
      const { status } = req.body;

      if (!Object.values(PaymentStatus).includes(status)) {
        res.status(400).json({
          message: "Invalid payment status",
          error: true,
        });
        return;
      }

      const order = await OrderServices.updateOrderPaymentStatus(
        reference,
        status
      );

      res.status(200).json({
        message: "Order payment status updated",
        data: order,
        error: false,
      });
    }
  );

  updateOrderStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!Object.values(OrderStatus).includes(status)) {
        res.status(400).json({
          message: "Invalid order status",
          error: true,
        });
        return;
      }

      const order = await OrderServices.updateOrderStatus(orderId, status);

      res.status(200).json({
        message: "Order status updated successfully",
        data: order,
        error: false,
      });
    }
  );
}

export const OrderController = new orderController();
