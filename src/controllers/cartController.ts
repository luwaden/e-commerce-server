import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { CartServices } from "../services/cartServices";
import { AuthRequest } from "../middleware/authorization.mw";

class cartController {
  addToCart = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { items } = req.body;
      const authReq = req as AuthRequest;
      const userId = authReq.userId;
      console.log(userId);

      if (!userId) {
        res.status(401).json({
          message: "Authentication required",
          error: true,
        });
      }

      if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({
          message: "Items array is required",
          error: true,
        });
      }

      const isValidItems = items.every(
        (item: any) =>
          item.productId &&
          typeof item.productId === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0
      );

      if (!isValidItems) {
        res.status(400).json({
          message:
            "Invalid items format. Each item must have productId and quantity > 0",
          error: true,
        });
        return;
      }

      const cart = await CartServices.addToCart(userId, items);

      res.status(200).json({
        message: "Item added to cart successfully",
        data: cart,
        error: false,
      });
    }
  );

  updateCartItem = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { quantity } = req.body;
      const { productId } = req.params;
      const authReq = req as AuthRequest;
      const userId = authReq.userId;
      const cart = await CartServices.updateCartItem(
        userId,
        productId,
        quantity
      );

      res.status(200).json({
        message: "Item added to cart successfully",
        data: cart,
        error: false,
      });
    }
  );

  removeCartItem = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { quantity } = req.body;
      const { productId } = req.params;
      const authReq = req as AuthRequest;
      const userId = authReq.userId;
      const cart = await CartServices.removeCartItem(userId, productId);

      res.status(200).json({
        message: "Item removed from cart successfully",
        data: cart,
        error: false,
      });
    }
  );
}

export const CartController = new cartController();
