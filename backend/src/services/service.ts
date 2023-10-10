import Link from '../db/models/model';
import shrinkLink from '../api/shrink-api';
import redis from '../db/models/redisDb';

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
}

export default new linkService();
