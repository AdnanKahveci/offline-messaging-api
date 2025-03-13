import User from './user.model';
import Message from './Message.model';
import BlockedUser from './blockedUser.model';
import ActivityLog from './activityLog.model';

// Define associations between models
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });

User.hasMany(BlockedUser, { foreignKey: 'blockerId', as: 'blockedUsers' });
User.hasMany(BlockedUser, { foreignKey: 'blockedId', as: 'blockedByUsers' });

User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activityLogs' });

export {
  User,
  Message,
  BlockedUser,
  ActivityLog
}; 