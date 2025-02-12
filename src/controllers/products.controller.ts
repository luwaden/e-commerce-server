import express, { Request, Response, NextFunction } from "express";
import { ProductServices } from "../services/productServices";
import asyncHandler from "express-async-handler";
import ProductModel from "../models/productsModel";
import { AuthRequest } from "../middleware/authorization.mw";

class productController {
  postProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await ProductServices.postProducts(req, res);
    res.status(201).json({
      message: "Product posted  successfully",
      data: product,
      error: false,
    });
  });
  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductServices.getProducts(req, res);
    res.status(200).json({
      message: "All Products gotten  successfully",
      data: products,
      error: false,
    });
  });

  getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductServices.getOneProductBySlug(req, res);
    res.status(200).json({
      message: "Single product by slug  successfully",
      data: product,
      error: false,
    });
  });

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductServices.getOneProductById(req, res);
    res.status(200).json({
      message: "Single product by ID  successfully",
      data: product,
      error: false,
    });
  });

  updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updatedProduct = await ProductServices.updateProduct(req, res);
    res.status(200).json({
      message: "Single product updated successfully",
      data: updatedProduct,
      error: false,
    });
  });

  deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deletedProduct = await ProductServices.deleteProduct(req, res);
    res.status(200).json({
      message: "Single product deleted successfully",
      data: deletedProduct,
      error: false,
    });
  });
}

export const ProductController = new productController();
