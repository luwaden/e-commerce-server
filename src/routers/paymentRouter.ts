import { Router } from "express";
import { paymentController } from "../controllers/paymentController";

const paymentRouter = Router();
paymentRouter.post("/payment/initialize", paymentController.initializePayment);
paymentRouter.post("/payment/verify", paymentController.verifyPayment);
paymentRouter.post("/payment/refund", paymentController.refundPayment);
paymentRouter.post("/payment/webhook", paymentController.handleWebhook);

export default paymentRouter;
