import { Request, Response, NextFunction } from 'express';
import { z, ZodObject } from 'zod';

/**
 * Middleware for validating request data against a Zod schema
 * @param schema Zod schema to validate against
 * @param source Where to look for data to validate ('body', 'query', 'params')
 */
export const validate = <T extends ZodObject<z.ZodRawShape>>(schema: T, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get data from the specified source
      const data = req[source];
      
      // Validate data against schema
      await schema.parseAsync(data);
      
      // Data is valid, continue to next middleware or route handler
      next();
    } catch (error) {
      // Format Zod validation errors
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      
      // Handle unexpected errors
      console.error('Validation error:', error);
      res.status(500).json({ error: 'Validation failed due to server error' });
    }
  };
};