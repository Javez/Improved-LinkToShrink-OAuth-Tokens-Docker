import linkServices from '../services/service';
import { Request, Response } from 'express';
import { error } from 'console';

class linksController {
  shrinkUrl = async (req: Request, res: Response) => {
    try {
      const data = {
        url: req.body.url,
        shortUrl: undefined
      };
      res.send(await linkServices.shrinkUrl(data));
    } catch {
      console.log(error);
    }
  };

  addLink = async (req: Request, res: Response) => {
    try {
      const data = {
        url: req.body.url,
        shortUrl: req.body.shortUrl
      };
      await linkServices.addLink(data);
      res.send(data);
    } catch {
      console.log(error);
    }
  };

  getLinkByUrl = async (req: Request, res: Response) => {
    try {
      const url = req.query.url;
      const result = await linkServices.getLinkByUrl(url ? url.toString() : 'error');
      if (url === 'error') {
        throw new Error('Somethink went wrong');
      }
      const data = {
        url: url,
        shortUrl: result
      }
      res.send("your links: url:" + data.url + " and short url:" + data.shortUrl);
    } catch {
      console.log(error);
    }
  };

  getLinkByShortUrl = async (req: Request, res: Response) => {
    try {
      const shortUrl = req.query.shortUrl;
      const result = await linkServices.getLinkByShortUrl(shortUrl ? shortUrl.toString() : 'error');
      if (shortUrl === 'error') {
        throw new Error('Somethink went wrong');
      }
      const data = {
        url: result,
        shortUrl: shortUrl
      };
      res.send(
        'your links: url:' + data.url + ' and short url:' + data.shortUrl
      );
    } catch {
      console.log(error);
    }
  };
}

const linkController = new linksController();

export default linkController;
