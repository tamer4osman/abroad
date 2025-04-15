import { Request, Response, NextFunction } from 'express';

// Custom error class with status code
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Middleware to handle errors
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction 
): void => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  
  // Check if it's our custom API error
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message
    });
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    // @ts-expect-error - Prisma error has code property
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'A record with this data already exists',
        details: 'Unique constraint violation'
      });
      return;
    }
    
    // @ts-expect-error - Prisma error has code property
    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'Record not found',
        details: 'The requested resource does not exist'
      });
      return;
    }
  }
  
  // For jwt errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid token'
    });
    return;
  }
  
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expired'
    });
    return;
  }
  
  // Default error handler for unhandled errors
  res.status(500).json({
    error: 'Internal Server Error',
    // Only show detailed error in development
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Middleware to handle 404 Not Found
export const notFoundHandler = (
  req: Request, 
  res: Response, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  res.status(404).json({
    error: `Not Found: ${req.method} ${req.originalUrl}`
  });
};