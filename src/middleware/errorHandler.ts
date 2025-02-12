import { Request, Response, NextFunction } from "express";

// Error handling middleware
const errorMiddleware = (
  err: Error & { statusCode?: number; code?: number; errors?: any },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  }

  // Handle MongoDB Duplicate Key Errors
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  console.error(`Error: ${message}`);

  res.status(statusCode).json({
    status: statusCode,
    error: true,
    message,
  });
};

export default errorMiddleware;
