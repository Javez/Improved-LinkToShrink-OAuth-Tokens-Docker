import { Model } from 'sequelize';

export default class User extends Model {
  id!: number;
  username!: string;
  email!: string;
  password!: string;
}
