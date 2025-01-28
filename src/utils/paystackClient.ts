import axios from "axios";

const paystackClient = axios.create({
  baseURL: "https://api.paystack.co", // Base URL for Paystack API
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Add your secret key
    "Content-Type": "application/json",
  },
});

export default paystackClient;
