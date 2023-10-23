import { DataTypes, Model } from 'sequelize';
import db from './sequelizeDb';
import Link from './Link';
import User from './User';

const sequelize = db.getInstance;

Link.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    shortUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    modelName: 'Link',
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    sequelize: sequelize
  }
);

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    modelName: 'User',
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    sequelize: sequelize
  }
);