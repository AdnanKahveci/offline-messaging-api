import { Request, Response, NextFunction } from 'express';
import { BlockedUser, User } from '../models';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';

/**
 * Block a user
 * @route POST /api/block
 * @access Private
 */
export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { blockedId } = req.body;
    const blockerId = req.user.id;

    // Check if user to block exists
    const userToBlock = await User.findByPk(blockedId);
    if (!userToBlock) {
      return next(new AppError('User to block not found', 404));
    }

    // Check if user is already blocked
    const existingBlock = await BlockedUser.findOne({
      where: {
        blockerId,
        blockedId,
      },
    });

    if (existingBlock) {
      return next(new AppError('User is already blocked', 400));
    }

    // Create block
    const block = await BlockedUser.create({
      blockerId,
      blockedId,
    });

    res.status(201).json({
      success: true,
      data: block,
    });
  } catch (error) {
    logger.error(`Error blocking user: ${error}`);
    next(error);
  }
};

/**
 * Unblock a user
 * @route DELETE /api/block/:id
 * @access Private
 */
export const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockedId = parseInt(req.params.id);
    const blockerId = req.user.id;

    // Find block
    const block = await BlockedUser.findOne({
      where: {
        blockerId,
        blockedId,
      },
    });

    if (!block) {
      return next(new AppError('Block not found', 404));
    }

    // Delete block
    await block.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error(`Error unblocking user: ${error}`);
    next(error);
  }
};

/**
 * Get blocked users
 * @route GET /api/block
 * @access Private
 */
export const getBlockedUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockerId = req.user.id;

    // Get blocked users
    const blockedUsers = await BlockedUser.findAll({
      where: {
        blockerId,
      },
      include: [
        {
          model: User,
          as: 'blocked',
          attributes: ['id', 'username'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: blockedUsers,
    });
  } catch (error) {
    logger.error(`Error getting blocked users: ${error}`);
    next(error);
  }
}; 