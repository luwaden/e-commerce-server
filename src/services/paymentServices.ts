import paystackAPI from "../utils/paystackClient";
import Payment from "../models/paymentModel";
import Order from "../models/orderModel";
import { PaymentStatus, OrderStatus } from "../utils/enumsUtil";
import ErrorResponse from "../utils/ApiError";
import crypto from "crypto";
import PaystackAPI from "../utils/paystackClient";
import paymentQueue from "../utils/redisClient";

class PaymentServices {
  // 🚀 Initialize Payment
  async initializePayment(orderId: string, email: string) {
    // Fetch order in a single query and return plain JavaScript object for efficiency
    const order = await Order.findById(orderId).lean();
    if (!order) throw new ErrorResponse("Order not found.", 404);

    if (order.paymentStatus === PaymentStatus.Success) {
      throw new ErrorResponse("Payment already completed for this order.", 400);
    }

    let paymentReference = order.paymentReference;

    // ✅ Generate a new reference ONLY if none exists
    if (!paymentReference) {
      paymentReference = `PAYREF-${Date.now()}-${crypto
        .randomBytes(8)
        .toString("hex")}`;

      // ✅ Ensure the new reference is unique
      const existingOrder = await Order.findOne({ paymentReference }).lean();
      if (existingOrder) {
        throw new ErrorResponse(
          "Payment reference already exists. Please try again.",
          400
        );
      }

      // ✅ Store the reference in the database
      await Order.updateOne({ _id: orderId }, { paymentReference });
    }

    const response = await paystackAPI.request(
      "post",
      `/transaction/initialize`,
      {
        email,
        amount: order.totalPrice * 100, // Convert to kobo
        reference: paymentReference,
        callback_url: `${process.env.BASE_URL}/api/payments/verify`,
      }
    );
    console.log("Paystack Response:", response);

    if (!response || !response.data || !response.data.status) {
      throw new ErrorResponse("Failed to initialize payment.", 500);
    }

    // Only update the order if paymentReference was not set before
    if (!order.paymentReference) {
      await Order.updateOne(
        { _id: orderId },
        { $unset: { paymentReference: "" } }
      );
      throw new ErrorResponse("Failed to initialize payment.", 500);
    }

    await Order.updateOne({ _id: orderId }, { paymentReference });

    return {
      authorization_url: response.data.data.authorization_url,
      orderId: orderId,
    };
  }

  // 🚀 Verify Payment & Update Order
  async verifyPayment(reference: string) {
    const response = await paystackAPI.request(
      "get",
      `/transaction/verify/${reference}`
    );
    if (!response.data.status)
      throw new ErrorResponse("Failed to verify payment.", 500);

    const transaction = response.data.data;
    if (transaction.status !== "success")
      throw new ErrorResponse("Payment verification failed.", 400);

    const order = await Order.findOneAndUpdate(
      { paymentReference: reference },
      {
        paymentStatus: PaymentStatus.Success,
        isPaid: true,
        paidAt: new Date(),
        orderStatus: OrderStatus.Processing,
      },
      { new: true }
    );

    if (!order) throw new ErrorResponse("Order not found.", 404);

    return order;
  }

  async handleWebhook(signature: string | undefined, payload: any) {
    if (!signature) throw new ErrorResponse("Signature required.", 400);

    // ✅ Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (hash !== signature) throw new ErrorResponse("Invalid signature.", 401);

    const { event, data } = payload;

    // ✅ Add successful payment to Redis-backed queue for async processing
    if (event === "charge.success") {
      console.log(
        `✅ Adding payment processing job for reference ${data.reference}`
      );
      await paymentQueue.add(data);
    } else {
      console.log(`Unhandled Paystack event: ${event}`);
    }
  }

  // 🚀 Refund Payment
  async refundPayment(transactionId: string) {
    const payment = await Payment.findOne({ transactionId });
    if (!payment) throw new ErrorResponse("Payment record not found.", 404);

    if (payment.paymentStatus !== PaymentStatus.Success) {
      throw new ErrorResponse(
        "Cannot refund a failed or pending payment.",
        400
      );
    }

    const order = await Order.findById(payment.orderId);
    if (!order) throw new ErrorResponse("Associated order not found.", 404);

    const response = await PaystackAPI.request("post", "/refund", {
      transaction: transactionId,
    });

    if (!response.data.status)
      throw new ErrorResponse("Failed to process refund.", 500);

    payment.paymentStatus = PaymentStatus.Refunded;
    await payment.save();

    order.orderStatus = OrderStatus.Refunded;
    await order.save();

    return { refund: response.data.data, order };
  }
}

export const paymentServices = new PaymentServices();
