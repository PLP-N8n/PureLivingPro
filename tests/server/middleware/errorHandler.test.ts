import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandler, AppError, sendSuccess, sendError } from '@server/middleware/errorHandler';

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonSpy: any;
  let statusSpy: any;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      path: '/api/test',
    };
    
    jsonSpy = vi.fn();
    statusSpy = vi.fn().mockReturnValue({ json: jsonSpy });
    
    mockRes = {
      status: statusSpy,
      json: jsonSpy,
    };
    
    mockNext = vi.fn();
  });

  it('should handle AppError with custom status code', () => {
    const error = new AppError('Test error', 400);
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Test error',
        code: 'AppError',
      },
    });
  });

  it('should handle generic errors with 500 status', () => {
    const error = new Error('Generic error');
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    
    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Generic error',
        code: 'Error',
      },
    });
  });

  it('should include stack trace in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const error = new Error('Test error');
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          details: expect.any(String),
        }),
      })
    );
    
    process.env.NODE_ENV = originalEnv;
  });
});

describe('Helper Functions', () => {
  let mockRes: Partial<Response>;
  let jsonSpy: any;
  let statusSpy: any;

  beforeEach(() => {
    jsonSpy = vi.fn();
    statusSpy = vi.fn().mockReturnValue({ json: jsonSpy });
    
    mockRes = {
      status: statusSpy,
      json: jsonSpy,
    };
  });

  describe('sendSuccess', () => {
    it('should send success response with data', () => {
      const testData = { id: 1, name: 'Test' };
      
      sendSuccess(mockRes as Response, testData);
      
      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: testData,
      });
    });

    it('should include message if provided', () => {
      const testData = { id: 1 };
      const message = 'Operation successful';
      
      sendSuccess(mockRes as Response, testData, message);
      
      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message,
      });
    });
  });

  describe('sendError', () => {
    it('should send error response with default status 400', () => {
      sendError(mockRes as Response, 'Test error');
      
      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Test error',
          code: 'API_ERROR',
        },
      });
    });

    it('should use custom status code', () => {
      sendError(mockRes as Response, 'Not found', 404);
      
      expect(statusSpy).toHaveBeenCalledWith(404);
    });
  });
});