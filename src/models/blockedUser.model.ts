import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user.model';

// BlockedUser attributes interface
interface BlockedUserAttributes {
  id: number;
  blockerId: number;
  blockedId: number;
  createdAt?: Date;
}

// BlockedUser creation attributes interface (id is optional for creation)
interface BlockedUserCreationAttributes extends Optional<BlockedUserAttributes, 'id'> {}

// BlockedUser model class
class BlockedUser extends Model<BlockedUserAttributes, BlockedUserCreationAttributes> implements BlockedUserAttributes {
  public id!: number;
  public blockerId!: number;
  public blockedId!: number;
  public readonly createdAt!: Date;
}

// Initialize BlockedUser model
BlockedUser.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    blockerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    blockedId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'blocked_users',
    timestamps: true,
    updatedAt: false, 
    indexes: [
      {
        unique: true,
        fields: ['blockerId', 'blockedId'],
      },
    ],
  }
);

// Define associations
BlockedUser.belongsTo(User, { foreignKey: 'blockerId', as: 'blocker' });
BlockedUser.belongsTo(User, { foreignKey: 'blockedId', as: 'blocked' });

export default BlockedUser; 