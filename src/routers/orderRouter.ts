import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import authMiddleware from "../middleware/authorization.mw";

const orderRouter = Router();

orderRouter.post("/order", authMiddleware, OrderController.createOrder);
orderRouter.put("/order/:id", authMiddleware, OrderController.getUserOrders);
orderRouter.delete(
  "/order/:id",
  authMiddleware,
  OrderController.updateOrderPaymentStatus
);
orderRouter.get(
  "/order/my-orders",
  authMiddleware,
  OrderController.getUserOrders
);

orderRouter.get("order/:id", authMiddleware, OrderController.getOrderById); // <-- Add this

export default orderRouter;
