import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

interface DecodedToken {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header
 */
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header using optional chaining
    const token = req.headers.authorization?.startsWith('Bearer ') 
      ? req.headers.authorization.split(' ')[1]
      : null;
    
    if (!token) {
      res.status(401).json({ error: 'Authentication required. No token provided.' });
      return;
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Optional: Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.id },
    });
    
    if (!user?.is_active) {
      res.status(401).json({ error: 'User not found or inactive.' });
      return;
    }
    
    // Add user info to request object for use in route handlers
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    // Continue to next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token.' });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired.' });
      return;
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
};

/**
 * Authorization middleware to restrict access based on user role
 * @param roles Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Check if user exists and their role is allowed using optional chaining
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
      return;
    }
    
    // User has required role, continue to route handler
    next();
  };
};