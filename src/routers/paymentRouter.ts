import { Router } from "express";
import {
  initializePayment,
  refundPayment,
  verifyPayment,
} from "../controllers/paymentController";

const paymentRouter = Router();
paymentRouter.post("/payment", initializePayment);
paymentRouter.post("/payment", verifyPayment);
paymentRouter.post("/payment", refundPayment);

export default paymentRouter;
