import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel";
import Product from "../models/productsModel";
import { IProduct } from "../interface/productsInterfcae";

export const addToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || !quantity || quantity < 1) {
      res.status(400).json({
        error: true,
        message: "User ID, Product ID, and a valid quantity are required",
      });
      return; // Ensure to return after sending a response
    }

    // Fetch the product details
    const product = (await Product.findById(productId)) as IProduct;
    if (!product) {
      res.status(404).json({
        error: true,
        message: "Product not found",
      });
      return; // Ensure to return after sending a response
    }

    // Check stock availability
    if (product.countInStock < quantity) {
      res.status(400).json({
        error: true,
        message: "Insufficient stock for this product",
      });
      return; // Ensure to return after sending a response
    }

    // Check if the user already has a cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      const totalPrice = product.price * quantity;
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity,
            price: product.price, // Include the price property
          },
        ],
        totalPrice,
      });

      await cart.save();
      res.status(201).json({
        error: false,
        message: "Cart created and product added successfully",
        data: cart,
      });
      return; // Ensure to return after sending a response
    }

    // If the cart exists, check if the product is already in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // Update the quantity of the existing product
      existingItem.quantity += quantity;
      cart.totalPrice += product.price * quantity; // Adjust the total price
    } else {
      // Add the new product to the cart
      cart.items.push({
        productId,
        quantity,
        price: product.price, // Include the price property
      });
    }

    // Update the total price of the cart
    cart.totalPrice += product.price * quantity;

    await cart.save(); // Save the updated cart

    res.status(200).json({
      error: false,
      message: "Product added to cart successfully",
      data: cart,
    });
  }
);

export const updateToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || quantity === undefined) {
      res.status(400).json({
        error: true,
        message: "User ID, Product ID, and a valid quantity are required",
      });
      return;
    }

    if (quantity < 0) {
      res.status(400).json({
        error: true,
        message: "Quantity cannot be negative",
      });
      return;
    }

    // Fetch the product details
    const product = (await Product.findById(productId)) as IProduct;
    if (!product) {
      res.status(404).json({
        error: true,
        message: "Product not found",
      });
      return;
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({
        error: true,
        message: "Cart not found",
      });
      return;
    }

    // Check if the product exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!existingItem) {
      res.status(404).json({
        error: true,
        message: "Product not found in the cart",
      });
      return;
    }

    // Update the quantity
    if (quantity > 0) {
      // **Increase Quantity**: Add the quantity and adjust the total price
      if (product.countInStock < existingItem.quantity + quantity) {
        res.status(400).json({
          error: true,
          message: "Insufficient stock for this product",
        });
        return;
      }

      existingItem.quantity += quantity; // Increase the quantity
      cart.totalPrice += product.price * quantity; // Adjust the total price
    } else if (quantity === 0) {
      // **Remove Item**: If quantity is 0, remove the item from the cart
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
      cart.totalPrice -= existingItem.quantity * existingItem.price; // Deduct total price for that item
    } else {
      // **Decrease Quantity**: Subtract quantity and adjust the total price
      if (existingItem.quantity + quantity < 1) {
        res.status(400).json({
          error: true,
          message:
            "Quantity cannot be reduced below 1. Use quantity = 0 to remove the item.",
        });
        return;
      }

      existingItem.quantity += quantity; // Reduce the quantity
      cart.totalPrice += product.price * quantity; // Adjust the total price
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      error: false,
      message: "Cart updated successfully",
      data: cart,
    });
  }
);

export const removeFromCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, productId } = req.body;

    // Validate input
    if (!userId || !productId) {
      res.status(400).json({
        error: true,
        message: "User ID and Product ID are required",
      });
      return; // Ensure to return after sending a response
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({
        error: true,
        message: "Cart not found",
      });
      return; // Ensure to return after sending a response
    }

    // Check if the product exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!existingItem) {
      res.status(404).json({
        error: true,
        message: "Product not found in cart",
      });
      return; // Ensure to return after sending a response
    }

    // Remove the product from the cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // Update the total price of the cart
    cart.totalPrice -= existingItem.quantity * existingItem.price;

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      error: false,
      message: "Product removed from cart successfully",
      data: cart,
    });
  }
);
