// app-controller.test.ts
import appController from '../../src/controllers/app-controller';
import linkServices from '../../src/services/service';
import { Request, Response } from 'express';

jest.mock('../services/service');

describe('appController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn()
    } as unknown as Response;
  });

  test('shrinkUrl', async () => {
    req.body = { url: 'testUrl' };
    (linkServices.getLinkByUrl as jest.Mock).mockResolvedValueOnce(null);
    (linkServices.shrinkUrl as jest.Mock).mockResolvedValueOnce('shortUrl');

    await appController.shrinkUrl(req, res);

    expect(res.send).toHaveBeenCalledWith('shortUrl');
  });

  test('addLink', async () => {
    req.body = { url: 'testUrl', shortUrl: 'shortUrl' };
    (linkServices.addLink as jest.Mock).mockResolvedValueOnce(undefined);

    await appController.addLink(req, res);

    expect(res.send).toHaveBeenCalledWith(req.body);
  });

  test('getLinkByUrl', async () => {
    req.query = { url: 'testUrl' };
    (linkServices.getLinkByUrl as jest.Mock).mockResolvedValueOnce('shortUrl');

    await appController.getLinkByUrl(req, res);

    expect(res.send).toHaveBeenCalledWith(
      'your links: url:testUrl and short url:shortUrl'
    );
  });

  test('getLinkByShortUrl', async () => {
    req.query = { shortUrl: 'shortUrl' };
    (linkServices.getLinkByShortUrl as jest.Mock).mockResolvedValueOnce(
      'testUrl'
    );

    await appController.getLinkByShortUrl(req, res);

    expect(res.send).toHaveBeenCalledWith(
      'your links: url:testUrl and short url:shortUrl'
    );
  });

  test('addUser', async () => {
    req.body = {
      username: 'testUser',
      email: 'testEmail',
      password: 'testPassword'
    };
    (linkServices.checkUser as jest.Mock).mockResolvedValueOnce(false);
    (linkServices.addUser as jest.Mock).mockResolvedValueOnce(true);

    await appController.addUser(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });

  test('checkUser', async () => {
    req.body = { email: 'testEmail', password: 'testPassword' };
    (linkServices.checkUser as jest.Mock).mockResolvedValueOnce('testUser');

    await appController.checkUser(req, res);

    expect(res.send).toHaveBeenCalledWith('testUser');
  });

  test('checkGoogleUser', async () => {
    req.body = { username: 'testUser', email: 'testEmail' };
    (linkServices.checkGoogleUser as jest.Mock).mockResolvedValueOnce(null);
    (linkServices.addGoogleUser as jest.Mock).mockResolvedValueOnce('testUser');

    await appController.checkGoogleUser(req, res);

    expect(res.send).toHaveBeenCalledWith('testUser');
  });
  // Add similar tests for getLinkByUrl, getLinkByShortUrl, addUser, checkUser, checkGoogleUser
});
