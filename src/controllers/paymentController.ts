import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import paystackClient from "../utils/paystackClient"; // Import Axios instance
import Payment from "../models/paymentModel"; // Import Payment model
import { PaymentStatus } from "../utils/enumsUtil";
import { AuthRequest } from "../middleware/authorization.mw";

export const initializePayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { amount, email, orderId } = req.body;

    if (!amount || !email || !orderId) {
      res.status(400);
      throw new Error("Missing required fields: amount, email, or orderId");
    }

    try {
      // Send initialization request to Paystack
      const response = await paystackClient.post("/transaction/initialize", {
        email,
        amount: amount * 100, // Convert to kobo
        callback_url: `${process.env.BASE_URL}/api/payments/verify`, // Callback for payment verification
      });

      if (!response.data.status) {
        res.status(500);
        throw new Error("Failed to initialize payment with Paystack");
      }

      // Save payment record to the database
      const payment = await Payment.create({
        userId: req.user, // From auth middleware
        orderId,
        paymentMethod: "Paystack",
        paymentStatus: PaymentStatus.Pending,
        transactionId: response.data.data.reference,
        amount,
      });

      res.status(201).json({
        message: "Payment initialized successfully",
        authorization_url: response.data.data.authorization_url, // Redirect user here
        payment,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.response?.data?.message || "Internal server error",
      });
    }
  }
);

export const verifyPayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { reference } = req.query;

    if (!reference) {
      res.status(400);
      throw new Error("Payment reference is required");
    }

    try {
      // Verify transaction with Paystack
      const response = await paystackClient.get(
        `/transaction/verify/${reference}`
      );

      if (!response.data.status) {
        res.status(500);
        throw new Error("Failed to verify payment with Paystack");
      }

      const transaction = response.data.data;

      // Update payment status in the database
      const payment = await Payment.findOneAndUpdate(
        { transactionId: reference },
        {
          paymentStatus:
            transaction.status === "success"
              ? PaymentStatus.Success
              : PaymentStatus.Failed,
        },
        { new: true }
      );

      if (!payment) {
        res.status(404);
        throw new Error("Payment record not found");
      }

      res.status(200).json({
        message: "Payment verified successfully",
        payment,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.response?.data?.message || "Internal server error",
      });
    }
  }
);

export const refundPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { transactionId } = req.body;

    if (!transactionId) {
      res.status(400);
      throw new Error("Transaction ID is required for a refund");
    }

    try {
      // Initiate refund request to Paystack
      const response = await paystackClient.post("/refund", {
        transaction: transactionId,
      });

      if (!response.data.status) {
        res.status(500);
        throw new Error("Failed to process refund with Paystack");
      }

      res.status(200).json({
        message: "Refund initiated successfully",
        refund: response.data.data,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.response?.data?.message || "Internal server error",
      });
    }
  }
);
