import Order from "../models/orderModel";
import paymentQueue from "./redisClient";
import { PaymentStatus, OrderStatus } from "./enumsUtil";

// ✅ Process the payment verification queue
paymentQueue.process(async (job) => {
  const { reference } = job.data;

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

  if (!order) {
    console.error(`❌ Order with reference ${reference} not found.`);
  } else {
    console.log(`✅ Order ${order._id} updated successfully.`);
  }
});
