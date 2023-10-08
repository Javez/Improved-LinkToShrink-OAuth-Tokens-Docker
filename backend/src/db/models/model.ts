import { DataTypes, Model } from 'sequelize';
import db from './sequelizeDb';

const sequelize = db.getInstance;

export default class Link extends Model {
  id!: number;
  url!: string;
  shortUrl!: string;
}

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
