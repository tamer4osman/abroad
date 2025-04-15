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

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. No token provided.' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Optional: Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.id },
    });
    
    if (!user || !user.is_active) {
      res.status(401).json({ error: 'User not found or inactive.' });
      return;
    }
    
    // Add user info to request object for use in route handlers
    (req as any).user = {
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
  return (req: Request, res: Response, next: NextFunction): void => {
    // First ensure user is authenticated
    if (!(req as any).user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    
    // Check if user role is allowed
    const userRole = (req as any).user.role;
    
    if (!roles.includes(userRole)) {
      res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
      return;
    }
    
    // User has required role, continue to route handler
    next();
  };
};