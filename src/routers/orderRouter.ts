import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  updateOrder,
  getOrderById, // <-- Add this
} from "../controllers/orderController";

const orderRouter = Router();

orderRouter.post("/order/", createOrder);
orderRouter.put("/order/:id", updateOrder);
orderRouter.delete("/order/:id", deleteOrder);
orderRouter.get("order/:id", getOrderById); // <-- Add this

export default orderRouter;
