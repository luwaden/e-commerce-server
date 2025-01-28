import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productsModel";

export const getPaginatedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    // Fetch paginated products
    const products = await Product.find().skip(skip).limit(pageSize);

    // Total count of products
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      message: "Products retrieved successfully",
      page,
      pageSize,
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      data: products,
    });
  }
);
