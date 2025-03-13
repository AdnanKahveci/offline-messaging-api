import express from 'express';
import { getActivityLogs, createActivityLog } from '../controllers/activity.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/activity:
 *   get:
 *     summary: Get activity logs for current user
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getActivityLogs);

/**
 * @swagger
 * /api/activity:
 *   post:
 *     summary: Create activity log
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 description: Activity action
 *     responses:
 *       201:
 *         description: Activity log created successfully
 *       400:
 *         description: Action is required
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createActivityLog);

export default router; 