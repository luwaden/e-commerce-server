import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productsModel"; // Product model

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const indexes = await Product.collection.indexes()
  // Perform a full-text search on the products collection
  const products = await Product.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: ‘textScore’ } }
  )
    .sort({ score: { $meta: ‘textScore’ } })
    .skip(skip)
    .limit(limit);
    // Get the total number of matching products
  const total = await Product.countDocuments({ $text: { $search: searchTerm } });
  res.status(200).json({
    error: false,
    data: products,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalProducts: total,
  });
});

export const getProductsByCategory = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
      const category = req.params.category;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const products = await Product.find({ category }).skip(skip).limit(limit);
      const total = await Product.countDocuments({ category });
      const totalPages = Math.ceil(total / limit);
      res.status(200).json({
          error: false,
          data: products,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          message: “Products fetched successfully”
          });
})