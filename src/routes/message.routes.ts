import express from 'express';
import { sendMessage, getMessages, getUserMessages } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message to another user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverUsername
 *               - content
 *             properties:
 *               receiverUsername:
 *                 type: string
 *                 description: Username of the user to send the message to
 *               content:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked)
 *       404:
 *         description: Receiver not found
 */
router.post('/', authenticate, sendMessage);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get messages between current user and another user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the other user
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/', authenticate, getMessages);

/**
 * @swagger
 * /api/messages/me:
 *   get:
 *     summary: Get all messages for current user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, getUserMessages);

export default router; 