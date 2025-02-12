import { Router } from "express";
import { CartController } from "../controllers/cartController";
import authMiddleware from "../middleware/authorization.mw";

const cartRouter = Router();
cartRouter.post("/cart/:productId", authMiddleware, CartController.addToCart);

// cartRouter.put("/cart/:id", handleUpdateCart);
// cartRouter.delete("/cart/:id", handleRemoveCartItem);

export default cartRouter;
