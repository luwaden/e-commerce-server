import { Router, Request, Response, NextFunction } from "express";
import {
  getProducts,
  postProducts,
  updateProduct,
  getOneProductBySlug,
  getOneProductById,
  deleteProduct,
} from "../controllers/products.controller";
import authMiddleware from "../middleware/authorization.mw";

const productsRouter = Router();
productsRouter.post("/products", authMiddleware, postProducts);
productsRouter.get("/products", getProducts);
productsRouter.get("/products/slug/:slug", getOneProductBySlug);
productsRouter.get("/products/:id", getOneProductById);
productsRouter.put("/products/:id", authMiddleware, updateProduct);
productsRouter.delete("/products/:id", authMiddleware, deleteProduct);

export default productsRouter;
