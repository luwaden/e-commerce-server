import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productsModel"; // Product model

// Search Products with Pagination and Sorting
export const searchProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      keyword,
      category,
      brand,
      priceMin,
      priceMax,
      sort,
      page,
      pageSize,
    } = req.query;

    const query: any = {};

    // Keyword-based search using MongoDB text index
    if (keyword) {
      query.$text = { $search: keyword }; // Full-text search
    }

    // Add category and brand filters
    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    // Add price range filter
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // Pagination and Sorting
    const pageNum = Number(page) || 1;
    const limit = Number(pageSize) || 10;
    const skip = (pageNum - 1) * limit;

    // Sorting (e.g., "price" or "-price" for descending)
    const sortBy = sort || "name";

    // Fetch matching products with pagination and sorting
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    // Get total count of matching products (for pagination info)
    const totalCount = await Product.countDocuments(query);

    res.status(200).json({
      message: "Search results retrieved successfully",
      page: pageNum,
      pages: Math.ceil(totalCount / limit),
      count: products.length,
      totalResults: totalCount,
      data: products,
    });
  }
);
