import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // Log the error for debugging
  console.error(`${req.method} ${req.path} - ${statusCode} - ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code: error.name || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    }
  };

  res.status(statusCode).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const sendSuccess = <T>(res: Response, data: T, message?: string) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message })
  };
  res.json(response);
};

export const sendError = (res: Response, message: string, statusCode: number = 400) => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code: 'API_ERROR'
    }
  };
  res.status(statusCode).json(response);
};