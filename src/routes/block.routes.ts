import express from 'express';
import { blockUser, unblockUser, getBlockedUsers } from '../controllers/block.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/block:
 *   post:
 *     summary: Block a user
 *     tags: [Blocks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blockedId
 *             properties:
 *               blockedId:
 *                 type: integer
 *                 description: ID of the user to block
 *     responses:
 *       201:
 *         description: User blocked successfully
 *       400:
 *         description: User is already blocked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User to block not found
 */
router.post('/', authenticate, blockUser);

/**
 * @swagger
 * /api/block:
 *   get:
 *     summary: Get blocked users
 *     tags: [Blocks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blocked users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getBlockedUsers);

/**
 * @swagger
 * /api/block/{id}:
 *   delete:
 *     summary: Unblock a user
 *     tags: [Blocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to unblock
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Block not found
 */
router.delete('/:id', authenticate, unblockUser);

export default router; 