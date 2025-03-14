import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user.model';

// Message attributes interface
interface MessageAttributes {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt?: Date;
}

// Message creation attributes interface
interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

// Message model class
class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public senderId!: number;
  public receiverId!: number;
  public content!: string;
  public readonly createdAt!: Date;
}

// Initialize Message model
Message.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    receiverId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    updatedAt: false, 
  }
);

// Define associations
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export default Message; 