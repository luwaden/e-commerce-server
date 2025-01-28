import express, { Request, Response } from "express";
import { sampleProducts } from "./data";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";
import productsRouter from "./routers/productRouter";
import authRouter from "./routers/auth.routes";
import cartRouter from "./routers/cartRouter";
import orderRouter from "./routers/orderRouter";

dotenv.config();
const app = express();
const connect = async (): Promise<void> => {
  //connect database
  await connectDB();
};

connect();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", productsRouter);
app.use("/api", cartRouter);
app.use("/api", authRouter);
app.use("/api", orderRouter);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});
