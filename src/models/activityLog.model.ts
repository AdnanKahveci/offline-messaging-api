import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user.model';

// ActivityLog attributes interface
interface ActivityLogAttributes {
  id: number;
  userId: number;
  action: string;
  timestamp?: Date;
}

// ActivityLog creation attributes interface (id is optional for creation)
interface ActivityLogCreationAttributes extends Optional<ActivityLogAttributes, 'id' | 'timestamp'> {}

// ActivityLog model class
class ActivityLog extends Model<ActivityLogAttributes, ActivityLogCreationAttributes> implements ActivityLogAttributes {
  public id!: number;
  public userId!: number;
  public action!: string;
  public timestamp!: Date;
}

// Initialize ActivityLog model
ActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'activity_logs',
    timestamps: false, 
  }
);

// Define associations
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default ActivityLog; 