import paystackClient from "../utils/paystackClient";
import Payment from "../models/paymentModel";
import Order from "../models/orderModel";
import { PaymentStatus, OrderStatus } from "../utils/enumsUtil";
import ErrorResponse from "../utils/ApiError";
import crypto from "crypto";

class PaymentServices {
  // 🚀 Initialize Payment
  async initializePayment(orderId: string, email: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new ErrorResponse("Order not found.", 404);

    if (order.paymentStatus === PaymentStatus.Success) {
      throw new ErrorResponse("Payment already completed for this order.", 400);
    }

    const paymentReference =
      order.paymentReference || `ORD-${orderId}-${Date.now()}`;

    const response = await paystackClient.post("/transaction/initialize", {
      email,
      amount: order.totalPrice * 100, // Convert to kobo
      reference: paymentReference,
      callback_url: `${process.env.BASE_URL}/api/payments/verify`,
    });

    if (!response.data.status)
      throw new ErrorResponse("Failed to initialize payment.", 500);

    if (!order.paymentReference) {
      order.paymentReference = paymentReference;
      await order.save();
    }

    return {
      authorization_url: response.data.data.authorization_url,
      orderId: order._id,
    };
  }

  // 🚀 Verify Payment & Update Order
  async verifyPayment(reference: string) {
    const response = await paystackClient.get(
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

  // 🚀 Handle Paystack Webhook
  async handleWebhook(signature: string | undefined, payload: any) {
    if (!signature) throw new ErrorResponse("Signature required.", 400);

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (hash !== signature) throw new ErrorResponse("Invalid signature.", 401);

    const { event, data } = payload;

    if (event === "charge.success") {
      const reference = data.reference;
      const transactionStatus =
        data.status === "success"
          ? PaymentStatus.Success
          : PaymentStatus.Failed;

      const order = await Order.findOneAndUpdate(
        { paymentReference: reference },
        {
          paymentStatus: transactionStatus,
          isPaid: transactionStatus === PaymentStatus.Success,
          paidAt:
            transactionStatus === PaymentStatus.Success ? new Date() : null,
          orderStatus:
            transactionStatus === PaymentStatus.Success
              ? OrderStatus.Processing
              : OrderStatus.Pending,
        },
        { new: true }
      );

      if (!order)
        console.error(`❌ Order with reference ${reference} not found.`);
      return order;
    }

    console.log(`Unhandled Paystack event: ${event}`);
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

    const response = await paystackClient.post("/refund", {
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
