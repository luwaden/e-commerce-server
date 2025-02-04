import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  updateOrder,
  getOrderById, // <-- Add this
} from "../controllers/orderController";

const orderRouter = Router();

orderRouter.post("/cart/", createOrder);
orderRouter.put("/cart/:id", updateOrder);
orderRouter.delete("/cart/:id", deleteOrder);
orderRouter.get("/:id", getOrderById); // <-- Add this

export default orderRouter;
