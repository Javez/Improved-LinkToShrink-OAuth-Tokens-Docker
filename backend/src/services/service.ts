import Link from '../db/models/Link';
import User from '../db/models/User';
import shrinkLink from '../api/shrink-api';
import redis from '../db/redisDb';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
dotenv.config();
export class linkService {
  async shrinkUrl(data: any) {
    try {
      const shrinkedUrl = await shrinkLink(data.url);
      data.shortUrl = shrinkedUrl.result_url;
      console.log(
        'data in the append queue' + '\n' + data.url,
        'and ' + data.shortUrl
      );

      await this.addLink(data);
      return data.shortUrl;
    } catch (error) {
      console.log(error);
    }
  }

  hashCodeUrl(url: string) {
    let hash = 0;
    for (let i = 0, len = url.length; i < len; i++) {
      let chr = url.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }

  async addLink(data: any) {
    try {
      const hash = this.hashCodeUrl(data.url);
      await redis
        .hset(`url_${hash}`, {
          url: data.url,
          shortUrl: data.shortUrl
        })
        .then(() => {
          console.log('REDIS PUSHED DATA');
        });

      const newLink = await Link.create(data);
      console.log('SEQUELIZE PUSHED DATA');
      return newLink.shortUrl;
    } catch (error) {
      console.log(error);
    }
  }

  async getLinkByUrl(url: any) {
    try {
      const hash = this.hashCodeUrl(url).toString();
      const linkRedis = await redis.hget(`url_${hash}`, 'shortUrl');
      if (linkRedis) {
        console.log('REDIS RETURNED DATA');
        return linkRedis;
      }
      const link = await Link.findOne({
        where: { url: url }
      });
      if (!link) {
        console.log('SEQUELIZE NOT FOUND DATA');
        return 'link not found';
      }
      console.log('SEQUELIZE RETURNED DATA');
      return link.shortUrl;
    } catch (error) {
      console.log(error);
    }
  }

  async getLinkByShortUrl(data: any) {
    try {
      const link = await Link.findOne({
        where: { shortUrl: data }
      });
      if (!link) {
        return 'post not available';
      }
      return link.url;
    } catch (error) {
      console.log(error);
    }
  }

  async addUser(data: any) {
    try {
      const newUser = await User.create(data);
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  async checkUser(data: any) {
    try {
      const user = await User.findOne({
        where: {
          username: data.username,
          email: data.email,
          password: data.password
        }
      });
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async checkUserWithGoogle(data: any) {
    try {
      if (data.token) {
        const ticket = await client.verifyIdToken({
          idToken: data.token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (payload) {
          data.email = payload.email;
        }
        const user = {
          email: data.email,
          idToken: data.token
        }
        return user;
      } else return false;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new linkService();
