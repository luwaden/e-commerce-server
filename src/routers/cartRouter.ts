import { Router } from "express";
import {
  addToCart,
  updateToCart,
  removeFromCart,
} from "../controllers/cartController";

const cartRouter = Router();
cartRouter.post("/cart/", addToCart);
cartRouter.put("/cart/:id", updateToCart);
cartRouter.delete("/cart/:id", removeFromCart);

export default cartRouter;
