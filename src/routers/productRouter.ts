import { Router, Request, Response, NextFunction } from "express";
import { ProductController } from "../controllers/products.controller";
import authMiddleware from "../middleware/authorization.mw";

const productsRouter = Router();
productsRouter.post(
  "/products",
  authMiddleware,
  ProductController.postProducts
);
productsRouter.get("/products", ProductController.getAllProducts);
productsRouter.get("/products/slug/:slug", ProductController.getProductBySlug);
productsRouter.get("/products/:id", ProductController.getProductById);
productsRouter.put(
  "/products/:id",
  authMiddleware,
  ProductController.getProductById
);
productsRouter.delete(
  "/products/:id",
  authMiddleware,
  ProductController.deleteProduct
);

export default productsRouter;
