import linkServices from '../services/service';
import { Request, Response } from 'express';
import { error } from 'console';
import dotenv from 'dotenv';

dotenv.config();
const _host = process.env.FRONTEND_HOST;
const _port = process.env.FRONTEND_PORT;
class appController {
  register = async (req: Request, res: Response) => {
    try {
      const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      };
      await linkServices.addUser(data);
      res.redirect(_host + ':' + _port + '/login');
    } catch {
      console.log(error);
    }
  }
  
  login = async (req: Request, res: Response) => {
    try {
      const data = {
        email: req.body.email,
        password: req.body.password
      };
      const token = await linkServices.checkUser(data);
      if (token) { 
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch {
      console.log(error);
    }
  }
 
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
      const result = await linkServices.getLinkByUrl(
        url ? url.toString() : 'error'
      );
      if (url === 'error') {
        throw new Error('Somethink went wrong');
      }
      const data = {
        url: url,
        shortUrl: result
      };
      res.send(
        'your links: url:' + data.url + ' and short url:' + data.shortUrl
      );
    } catch {
      console.log(error);
    }
  };

  getLinkByShortUrl = async (req: Request, res: Response) => {
    try {
      const shortUrl = req.query.shortUrl;
      const result = await linkServices.getLinkByShortUrl(
        shortUrl ? shortUrl.toString() : 'error'
      );
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

  addUser = async (req: Request, res: Response) => {
    try {
      const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      };
      await linkServices.addUser(data);
      res.send(data);
    } catch {
      console.log(error);
    }
  };

  checkUser = async (req: Request, res: Response) => {
    try {
      const data = {
        email: req.body.email,
        password: req.body.password
      };
      const result = await linkServices.checkUser(data);
      if (result) {
        res.redirect(`${_host}:${_port}/`);
        res.send(data);
      } else {
        res.redirect(
          `${_host}:${_port}/auth`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  checkUserWithGoogle = async (req: Request, res: Response) => {
    try {
      const data = {
        token: req.body.token
      };
      const result = await linkServices.checkUserWithGoogle(data);
      if (result) {
        res.redirect(
          `${_host}:${_port}/`
        );
        res.send(data);
      } else {
        res.redirect(
          `${_host}:${_port}/auth`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
}

const appControllerInstance = new appController();

export default appControllerInstance;