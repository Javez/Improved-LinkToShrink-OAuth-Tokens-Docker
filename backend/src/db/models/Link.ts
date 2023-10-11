import { Model } from 'sequelize';

export default class Link extends Model {
  id!: number;
  url!: string;
  shortUrl!: string;
}
