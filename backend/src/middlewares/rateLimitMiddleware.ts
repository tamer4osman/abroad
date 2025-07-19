
import { Request } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Standard API rate limiting middleware
 * Limits the number of requests a client can make within a time window
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  // Optional: Skip rate limiting for certain IPs (e.g., internal systems)
  skip: (req: Request) => {
    const trustedIps = process.env.TRUSTED_IPS?.split(',') || [];
    return trustedIps.includes(req.ip || '');
  }
});

/**
 * Stricter rate limit for authentication endpoints to prevent brute force attacks
 */
export const authRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit to 5 failed attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  // Only apply to failed authentication attempts
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many login attempts, please try again after an hour'
  }
});

/**
 * Rate limit for document upload endpoints
 * To prevent abuse of storage resources
 */
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit to 20 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Upload limit reached, please try again later'
  }
});

// You can export additional rate limiters for other specific endpoints as needed