import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import logger from '../utils/logger';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// JWT token interface
interface TokenPayload {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '123123') as TokenPayload;
    
    // Find user by id and attach to request
    User.findByPk(decoded.id)
      .then(user => {
        if (!user) {
          res.status(401).json({
            success: false,
            message: 'User not found.',
          });
          return;
        }
        
        // Attach user to request
        req.user = {
          id: user.id,
          username: user.username,
        };
        
        next();
      })
      .catch(error => {
        logger.error(`Authentication error: ${error}`);
        
        res.status(401).json({
          success: false,
          message: 'Invalid or expired token.',
        });
      });
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
}; 