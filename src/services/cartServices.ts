import { Types } from "mongoose";
import Cart from "../models/cartModel";
import Product from "../models/productsModel";
import { ICart } from "../interface/cartInterface";
import ErrorResponse from "../utils/ApiError";

class cartServices {
  addToCart = async (
    userId: string | undefined,
    items: { productId: string; quantity: number }[]
  ): Promise<ICart> => {
    if (!userId) {
      throw new ErrorResponse("User ID is required", 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new ErrorResponse("Items array is required", 400);
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId: new Types.ObjectId(userId),
        items: [],
        totalPrice: 0,
      });
    }

    // Process each item
    for (const { productId, quantity } of items) {
      if (quantity <= 0) {
        throw new ErrorResponse("Quantity must be greater than 0", 400);
      }

      // Validate and fetch product
      if (!Types.ObjectId.isValid(productId)) {
        throw new ErrorResponse(`Invalid product ID: ${productId}`, 400);
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new ErrorResponse(`Product ${productId} not found`, 404);
      }

      if (!product.price || product.price <= 0) {
        throw new ErrorResponse(`Invalid price for product ${productId}`, 400);
      }

      // Find if item already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Update existing item
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = product.price; // Update price in case it changed
      } else {
        // Add new item
        cart.items.push({
          productId: new Types.ObjectId(productId),
          quantity,
          price: product.price,
        });
      }
    }

    // Calculate total price with explicit type checking and logging
    cart.totalPrice = cart.items.reduce((total, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      return total + itemPrice * itemQuantity;
    }, 0);

    // Round to 2 decimal places
    cart.totalPrice = Number(cart.totalPrice.toFixed(2));

    // Save and populate product details
    const savedCart = await cart.save();
    return await savedCart.populate("items.productId");
  };

  updateCartItem = async (
    userId: string | undefined,
    cartItemId: string,
    quantity: number
  ): Promise<ICart> => {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) throw new ErrorResponse("Cart not found", 400);

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === cartItemId
    );
    if (itemIndex === -1) throw new ErrorResponse("Item not found", 400);

    cart.items[itemIndex].quantity = quantity;
    cart.totalPrice = cart.items.reduce((total, item) => {
      const product = item.productId as any;
      return total + item.quantity * product.price;
    }, 0);

    return cart.save();
  };

  removeCartItem = async (
    userId: string | undefined,
    cartItemId: string
  ): Promise<ICart> => {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) throw new ErrorResponse("Cart not found", 400);

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== cartItemId
    );
    cart.totalPrice = cart.items.reduce((total, item) => {
      const product = item.productId as any;
      return total + item.quantity * product.price;
    }, 0);

    return cart.save();
  };
}

export const CartServices = new cartServices();
