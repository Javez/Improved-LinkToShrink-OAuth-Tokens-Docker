import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelizeDb';

export class User extends Model {
  id!: number;
  username!: string;
  email!: string;
  password!: string;
}

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
    tableName: 'User',
    sequelize: sequelize
  }
);

export class GoogleUser extends Model {
  id!: number;
  username!: string;
  email!: string;
}

GoogleUser.init(
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
    }
  },
  {
    tableName: 'GoogleUser',
    sequelize: sequelize
  }
);

export class Link extends Model {
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
    tableName: 'Link',
    sequelize: sequelize
  }
);
