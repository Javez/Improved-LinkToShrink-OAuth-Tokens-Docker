import { Dialect, Sequelize } from 'sequelize';
import { User, GoogleUser, Link } from './models/model';
import dotenv from 'dotenv';

dotenv.config();
const env = process.env.NODE_ENV || 'development';

export class SequelizeDB {
  public sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      database: process.env[`${env.toUpperCase()}_DATABASE`] || '',
      username: process.env[`${env.toUpperCase()}_USERNAME`] || '',
      password: process.env[`${env.toUpperCase()}_PASSWORD`] || '',
      host: process.env[`${env.toUpperCase()}_HOST`] || '',
      port: parseInt(process.env[`${env.toUpperCase()}_PORT`] || '', 10),
      dialect: (process.env[`${env.toUpperCase()}_DIALECT`] || '') as Dialect
    });
  }

  public getInstance(): Sequelize {
    return this.sequelize;
  }

  public async openConnection() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
      return true;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return false;
    }
  }

  public async closeConnection() {
    try {
      await this.sequelize.close();
      console.log('Connection has been closed successfully');
      return true;
    } catch (error) {
      console.error('Unable to close the database connection:', error);
      return false;
    }
  }

  public async createTables() {
    try {
      await User.sync();
      await GoogleUser.sync();
      await Link.sync();
      console.log('Tables have been created successfully.');
      return true;
    } catch (error) {
      console.error('Unable to create tables:', error);
      return false;
    }
  }
}
const sequelizeDB = new SequelizeDB();

export const sequelize = sequelizeDB.sequelize;
