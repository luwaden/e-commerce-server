import Redis from "ioredis";
import Queue from "bull";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost", // Use the service name in Docker
  port: Number(process.env.REDIS_PORT) || 6379,
});

redisClient.on("connect", () => console.log("✅ Connected to Redis"));
// Create a job queue
export const paymentQueue = new Queue("process-payment", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

paymentQueue.on("failed", (job, err) => {
  console.error(`Job failed for reference ${job.data.reference}:`, err);
});

export default paymentQueue;
