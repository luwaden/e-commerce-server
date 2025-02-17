import { Router } from "express";
import { paymentController } from "../controllers/paymentController";
import authMiddleware from "../middleware/authorization.mw";

const paymentRouter = Router();
paymentRouter.post(
  "/payment/initialize",
  authMiddleware,
  paymentController.initializePayment
);
paymentRouter.post("/payment/verify", paymentController.verifyPayment);
paymentRouter.post("/payment/refund", paymentController.refundPayment);
paymentRouter.post("/payment/webhook", paymentController.handleWebhook);

export default paymentRouter;
