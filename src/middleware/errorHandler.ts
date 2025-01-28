import { Request, Response, NextFunction } from "express";

// Error handling middleware
const errorMiddleware = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500; // Default to 500 if no statusCode is provided
  const errorMessage = err.message || "Internal Server Error";

  // Log the error details
  console.error(`Error: ${errorMessage}`);
  console.error(`Stack: ${err.stack}`);

  // Send a JSON response with the error details
  res.status(statusCode).json({
    status: statusCode,
    error: true,
    message: errorMessage,
  });
};

export default errorMiddleware;
