import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/orderController";

const orderRouter = Router();
orderRouter.post("/cart/", createOrder);
orderRouter.put("/cart/:id", updateOrder);
orderRouter.delete("/cart/:id", deleteOrder);

export default orderRouter;
