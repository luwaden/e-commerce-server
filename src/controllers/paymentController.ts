import { Request, Response, NextFunction } from "express";
import { paymentServices } from "../services/paymentServices";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/ApiError";

class PaymentController {
  // 🚀 Initialize Payment
  initializePayment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { orderId, email } = req.body;
      if (!orderId || !email) {
        return next(new ErrorResponse("Order ID and email are required.", 400));
      }

      const paymentData = await paymentServices.initializePayment(
        orderId,
        email
      );
      res.status(200).json({ success: true, data: paymentData });
    }
  );

  // 🚀 Verify Payment
  verifyPayment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reference = req.params.reference; // Use params instead of query
      if (!reference) {
        return next(new ErrorResponse("Payment reference is required.", 400));
      }

      const order = await paymentServices.verifyPayment(reference);
      res.status(200).json({ success: true, data: order });
    }
  );

  // 🚀 Handle Paystack Webhook
  handleWebhook = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const signature = req.headers["x-paystack-signature"] as
        | string
        | undefined;
      const payload = req.body;

      await paymentServices.handleWebhook(signature, payload);

      // ✅ Always respond with 200 to acknowledge webhook processing
      res.sendStatus(200);
    }
  );

  // 🚀 Refund Payment
  refundPayment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { transactionId } = req.body;
      if (!transactionId) {
        return next(new ErrorResponse("Transaction ID is required.", 400));
      }

      const refundData = await paymentServices.refundPayment(transactionId);
      res.status(200).json({ success: true, data: refundData });
    }
  );
}

export default new PaymentController();

export const paymentController = new PaymentController();
