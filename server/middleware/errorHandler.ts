import { Request, Response, NextFunction } from 'express';

// Custom error interface
interface CustomError extends Error {
  status?: number;
}

// Function to create errors
export const createError = (message: string, status: number): CustomError => {
  const error = new Error(message) as CustomError;
  error.status = status;
  return error;
};

// Global error-handling middleware
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(`❌ Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
