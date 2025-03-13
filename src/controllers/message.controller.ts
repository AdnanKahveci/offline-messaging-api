import { Request, Response, NextFunction } from 'express';
import { Message, User, BlockedUser } from '../models';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';
import { Op } from 'sequelize';

/**
 * Send a message to another user
 * @route POST /api/messages
 * @access Private
 */
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receiverUsername, content } = req.body;
    const senderId = req.user.id;

    // Check if receiver exists by username
    const receiver = await User.findOne({
      where: { username: receiverUsername }
    });
    
    if (!receiver) {
      return next(new AppError(`User with username "${receiverUsername}" not found`, 404));
    }

    const receiverId = receiver.id;

    // Check if sender is blocked by receiver
    const isBlocked = await BlockedUser.findOne({
      where: {
        blockerId: receiverId,
        blockedId: senderId,
      },
    });

    if (isBlocked) {
      return next(new AppError('You cannot send messages to this user', 403));
    }

    // Create message
    const message = await Message.create({
      senderId,
      receiverId,
      content,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    logger.error(`Error sending message: ${error}`);
    next(error);
  }
};

/**
 * Get messages between two users
 * @route GET /api/messages
 * @access Private
 */
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.query.username as string;
    const currentUserId = req.user.id;
    
    if (!username) {
      return next(new AppError('Username query parameter is required', 400));
    }

    // Find user by username
    const otherUser = await User.findOne({
      where: { username }
    });

    if (!otherUser) {
      return next(new AppError(`User with username "${username}" not found`, 404));
    }

    const otherUserId = otherUser.id;

    // Get messages between users
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    logger.error(`Error getting messages: ${error}`);
    next(error);
  }
};

/**
 * Get all messages for current user
 * @route GET /api/messages/me
 * @access Private
 */
export const getUserMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    // Get all messages for user
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username'],
        },
      ],
      limit: 100,
    });

    // Group messages by conversation
    const conversations = messages.reduce((acc: any, message: any) => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      
      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          user: otherUser,
          messages: [],
        };
      }
      
      acc[otherUserId].messages.push(message);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: Object.values(conversations),
    });
  } catch (error) {
    logger.error(`Error getting user messages: ${error}`);
    next(error);
  }
}; 