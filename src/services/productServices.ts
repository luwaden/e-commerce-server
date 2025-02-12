import express, { Request, Response, NextFunction } from "express";

import asyncHandler from "express-async-handler";
import ProductModel from "../models/productsModel";
import { AuthRequest } from "../middleware/authorization.mw";

class productServices {
  postProducts = async (req: AuthRequest, res: Response) => {
    const requiredFields = [
      "name",
      "slug",
      "image",
      "category",
      "brand",
      "price",
      "countInStock",
      "description",
      "rating",
      "numReviews",
    ];
    if (req.role !== "admin") {
      res.status(403);
      throw new Error("Unauthorized: Admin access required");
    }
    for (const field of requiredFields) {
      if (!req.body[field]) {
        res.status(400);
        throw new Error(`Please provide the ${field} field`);
      }
    }

    const product = await ProductModel.create({
      ...req.body,
      createdBy: req.userId,
    });

    console.log(req.userId);

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  };

  getProducts = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    // Fetch paginated products
    const products = await ProductModel.find().skip(skip).limit(pageSize);

    // Total count of products
    const totalProducts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).json({
      message: "All Products retrieved successfully",
      data: products, // Ensure this is an array
      totalItem: totalProducts,
      totalPages,
      currentPage: page,
    });
  };

  getOneProductBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params; // Get product ID from the URL params

    if (!slug) {
      res.status(400);
      throw new Error("Product slug is required");
    }

    // Find the product by its ID
    const product = await ProductModel.findOne({ slug });

    // If product is not found
    if (!product) {
      res.status(404);
      throw new Error(`Product with ID ${slug} not found`);
    }

    res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  };

  getOneProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error("Product ID is required");
    }

    // Find the product by its ID
    const product = await ProductModel.findById(id);

    // If product is not found
    if (!product) {
      res.status(404);
      throw new Error(`Product with ID ${id} not found`);
    }

    res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  };

  updateProduct = async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // Get the product ID from the URL params
    const {
      name,
      slug,
      image,
      category,
      brand,
      price,
      countInStock,
      description,
      rating,
      numReviews,
    } = req.body;

    if (req.role !== "admin") {
      res.status(403);
      throw new Error("Unauthorized: Admin access required");
    }

    if (!id) {
      res.status(400);
      throw new Error("Product ID is required");
    }

    // Find and update the product by its ID
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id, // The product ID to find
      {
        $set: {
          name,
          slug,
          image,
          category,
          brand,
          price,
          countInStock,
          description,
          rating,
          numReviews,
          updatedBy: req.userId,
        },
        $currentDate: { updatedAt: true },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404);
      throw new Error(`Product with ID ${id} not found`);
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  };

  deleteProduct = async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // Get product ID from URL params

    if (req.role !== "admin") {
      res.status(403);
      throw new Error("Unauthorized: Admin access required");
    }

    if (!id) {
      res.status(400);
      throw new Error("Product ID is required");
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    // If no product is found
    if (!deletedProduct) {
      res.status(404);
      throw new Error(`Product with ID ${id} not found`);
    }

    res.status(200).json({
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  };
}

export const ProductServices = new productServices();
