import axios from "axios";
import ErrorResponse from "./ApiError";
import asyncHandler from "express-async-handler";
import { log } from "node:console";

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error(
    "PAYSTACK_SECRET_KEY is not defined in environment variables."
  );
}

const paystackClient = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

paystackClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from Paystack API response
    const errorMessage = error.response?.data?.message || "Paystack API error";
    return Promise.reject(new Error(errorMessage));
  }
);

class PaystackAPI {
  static async request(
    method: "get" | "post",
    endpoint: string,
    data: any = {}
  ) {
    console.log(
      `🔍 [Paystack] ${method.toUpperCase()} Request → ${endpoint}`,
      data
    );

    return paystackClient
      .request({ method, url: endpoint, data })
      .then((response) => {
        console.log("✅ [Paystack] Response:", response.data);
        if (!response.data.status) {
          throw new ErrorResponse(
            response.data.message || "Paystack API error",
            500
          );
        }
        return response.data;
      })
      .catch((error) => {
        console.error(
          "❌ [Paystack] API Error:",
          error.response?.data || error.message
        );
        throw new ErrorResponse("Paystack API error", 500);
      });
  }
}

export default PaystackAPI;
