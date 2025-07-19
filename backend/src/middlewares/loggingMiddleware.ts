import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for logging incoming requests and their responses
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate a unique ID for the request
  const requestId = Math.random().toString(36).substring(2, 15);
  
  // Get timestamp when request is received
  const startTime = new Date();
  const startHrTime = process.hrtime();
  
  // Log request details
  console.log(`[${requestId}] ${startTime.toISOString()} ${req.method} ${req.originalUrl} - Request received`);
  
  if (process.env.NODE_ENV === 'development') {
    // In development, also log headers and body (but sanitize sensitive data)
    console.log(`[${requestId}] Headers:`, sanitizeHeaders(req.headers));
    
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      console.log(`[${requestId}] Body:`, sanitizeBody(req.body));
    }
  }
  
  // Store request ID for potential use in controllers
  res.locals.requestId = requestId;
  
  // Capture response details
  const originalSend = res.send;
  res.send = function (body?: unknown): Response {
    // Calculate processing time
    const hrTime = process.hrtime(startHrTime);
    const processingTime = hrTime[0] * 1000 + hrTime[1] / 1000000;
    
    // Log response details
    console.log(
      `[${requestId}] ${new Date().toISOString()} ${req.method} ${req.originalUrl} - Response: ${res.statusCode} (${processingTime.toFixed(2)}ms)`
    );
    
    // Send actual response
    return originalSend.call(this, body);
  };
  
  next();
};

/**
 * Helper function to sanitize headers for logging
 * Removes sensitive data like authorization tokens
 */
function sanitizeHeaders(headers: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...headers };
  
  if (sanitized.authorization && typeof sanitized.authorization === 'string') {
    sanitized.authorization = sanitized.authorization.replace(/Bearer .+/, 'Bearer [REDACTED]');
  }
  
  if (sanitized.cookie) {
    sanitized.cookie = '[REDACTED]';
  }
  
  return sanitized;
}

/**
 * Helper function to sanitize request body for logging
 * Removes sensitive fields like passwords
 */
function sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ['password', 'password_confirmation', 'current_password', 'token', 'access_token', 'refresh_token'];
  const sanitized = { ...body };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}