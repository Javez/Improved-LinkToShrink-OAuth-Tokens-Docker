import { Sequelize, Options, Dialect } from 'sequelize';
import Link from './model';
import dotenv from 'dotenv';

dotenv.config();
const env = process.env.NODE_ENV || 'development';

class SequelizeDB {
  private sequelize: Sequelize;

  constructor(config: Options) {
    this.sequelize = new Sequelize(config);
  }
  public get getInstance(): Sequelize {
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

  public async createTable() {
    try {
      await this.sequelize.sync({ force: true });
      console.log('The table for the Links model was just (re)created!');
      console.log(
        this.sequelize.models.Link === Link
          ? 'models the same'
          : 'models different'
      );
      return true;
    } catch (error) {
      console.error('Unable to recreate model:', error);
      return false;
    }
  }
}

const databaseConfig: Options = {
  database: process.env[`${env.toUpperCase()}_DATABASE`] || '',
  username: process.env[`${env.toUpperCase()}_USERNAME`] || '',
  password: process.env[`${env.toUpperCase()}_PASSWORD`] || '',
  host: process.env[`${env.toUpperCase()}_HOST`] || '',
  port: parseInt(process.env[`${env.toUpperCase()}_PORT`] || '', 10),
  dialect: (process.env.TEST_DIALECT || 'mysql') as Dialect
};

const db = new SequelizeDB(databaseConfig);

export default db;
