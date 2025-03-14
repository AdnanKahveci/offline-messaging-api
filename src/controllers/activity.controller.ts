import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../models';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';

/**
 * Get activity logs for current user
 * @route GET /api/activity
 * @access Private
 */
export const getActivityLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Get activity logs
    const logs = await ActivityLog.findAndCountAll({
      where: {
        userId,
      },
      order: [['timestamp', 'DESC']],
      limit,
      offset,
    });

    // Pagination
    const totalPages = Math.ceil(logs.count / limit);

    res.status(200).json({
      success: true,
      data: {
        logs: logs.rows,
        pagination: {
          page,
          limit,
          totalItems: logs.count,
          totalPages,
        },
      },
    });
  } catch (error) {
    logger.error(`Error getting activity logs: ${error}`);
    next(error);
  }
};

/**
 * Create activity log
 * @route POST /api/activity
 * @access Private
 */
export const createActivityLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { action } = req.body;

    if (!action) {
      return next(new AppError('Action is required', 400));
    }

    // Create activity log
    const log = await ActivityLog.create({
      userId,
      action,
    });

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    logger.error(`Error creating activity log: ${error}`);
    next(error);
  }
}; 