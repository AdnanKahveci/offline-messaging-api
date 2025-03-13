import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, ActivityLog } from '../models';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    /*
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Symbol.for('sequelize.or')]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return next(new AppError('Username or email already exists', 400));
    }*/

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Log activity
    await ActivityLog.create({
      userId: user.id,
      action: 'User registered',
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || '123123',
      { expiresIn: '15m' }
    );

    // Return user data and token
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    logger.error(`Registration error: ${error}`);
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      // Log invalid login attempt
      logger.warn(`Invalid login attempt for username: ${username}`);
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Log invalid login attempt
      await ActivityLog.create({
        userId: user.id,
        action: 'Invalid login attempt',
      });
      
      logger.warn(`Invalid login attempt for user: ${user.id}`);
      return next(new AppError('Invalid credentials', 401));
    }

    // Log successful login
    await ActivityLog.create({
      userId: user.id,
      action: 'User logged in',
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || '123123',
      { expiresIn: '1d' }
    );

    // Return user data and token
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error}`);
    next(error);
  }
}; 