import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);

    // Find user by ID
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'createdAt'],
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Error getting user: ${error}`);
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/users/me
 * @access Private
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user ID from JWT
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'createdAt'],
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Error getting current user: ${error}`);
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/users/me
 * @access Private
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;

    // Find user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update user data
    if (email) user.email = email;
    if (password) user.password = password;

    // Save updated user
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    next(error);
  }
};

/**
 * Search users by username
 * @route GET /api/users/search
 * @access Private
 */
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return next(new AppError('Username query parameter is required', 400));
    }

    // Search users by username
    const users = await User.findAll({
      where: {
        username: {
          [Symbol.for('sequelize.like')]: `%${username}%`,
        },
      },
      attributes: ['id', 'username', 'createdAt'],
      limit: 10,
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error(`Error searching users: ${error}`);
    next(error);
  }
}; 