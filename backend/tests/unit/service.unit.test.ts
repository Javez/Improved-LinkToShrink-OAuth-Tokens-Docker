// linkService.test.ts
import { linkService } from '../../src/services/service';
import shrinkLink from '../../src/api/shrink-api';
import redis from '../../src/db/redis.db';
import { User, GoogleUser, Link } from '../../src/db/models/models';
import { createToken } from '../../src/middleware/auth/auth';

const token = createToken('test', 'test');

describe('linkService', () => {
    beforeEach(() => {
        jest.mock('../api/shrink-api');
        jest.mock('../db/redis.db');
        jest.mock('../db/models/models');
    })
  
    afterEach(() => {
    jest.clearAllMocks();
  });

  test('shrinkUrl', async () => {
    const data = { url: 'http://example.com' };
    const shrinkedUrl = { result_url: 'http://shrinked.com' };
    (shrinkLink as jest.Mock).mockResolvedValueOnce(shrinkedUrl);
    linkService.addLink = jest
      .fn()
      .mockResolvedValueOnce(shrinkedUrl.result_url);

    const result = await linkService.shrinkUrl(data);

    expect(result).toBe(shrinkedUrl.result_url);
    expect(shrinkLink).toHaveBeenCalledWith(data.url);
    expect(linkService.addLink).toHaveBeenCalledWith({
      ...data,
      shortUrl: shrinkedUrl.result_url
    });
  });

  test('hashCodeUrl', () => {
    const url = 'http://example.com';
    const result = linkService.hashCodeUrl(url);

    expect(typeof result).toBe('number');
  });

  test('addLink', async () => {
    const data = { url: 'http://example.com', shortUrl: 'http://shrinked.com' };
    (redis.hset as jest.Mock).mockResolvedValueOnce(undefined);
    (Link.create as jest.Mock).mockResolvedValueOnce(data);

    const result = await linkService.addLink(data);

    expect(result).toBe(data.shortUrl);
    expect(redis.hset).toHaveBeenCalledWith(
      `url_${linkService.hashCodeUrl(data.url)}`,
      {
        url: data.url,
        shortUrl: data.shortUrl
      }
    );
    expect(Link.create).toHaveBeenCalledWith(data);
  });

  test('getLinkByUrl', async () => {
    const url = 'http://example.com';
    const shortUrl = 'http://shrinked.com';
    (redis.hget as jest.Mock).mockResolvedValueOnce(shortUrl);
    (Link.findOne as jest.Mock).mockResolvedValueOnce({ shortUrl });

    const result = await linkService.getLinkByUrl(url);

    expect(result).toBe(shortUrl);
    expect(redis.hget).toHaveBeenCalledWith(
      `url_${linkService.hashCodeUrl(url)}`,
      'shortUrl'
    );
    expect(Link.findOne).toHaveBeenCalledWith({ where: { url } });
  });

  test('getLinkByShortUrl', async () => {
    const shortUrl = 'http://shrinked.com';
    const url = 'http://example.com';
    (Link.findOne as jest.Mock).mockResolvedValueOnce({ url });

    const result = await linkService.getLinkByShortUrl(shortUrl);

    expect(result).toBe(url);
    expect(Link.findOne).toHaveBeenCalledWith({ where: { shortUrl } });
  });

  test('addUser', async () => {
    const data = {
      username: 'test',
      email: 'test@example.com',
      password: 'test'
    };
    (User.create as jest.Mock).mockResolvedValueOnce(data);

    const result = await linkService.addUser(data);

    expect(result).toBe(true);
    expect(User.create).toHaveBeenCalledWith(data);
  });

  test('addGoogleUser', async () => {
    const data = { username: 'test', email: 'test@example.com' };
    const token = 'testToken';
    (GoogleUser.create as jest.Mock).mockResolvedValueOnce(data);
    (createToken as jest.Mock).mockReturnValueOnce(token);

    const result = await linkService.addGoogleUser(data);

    expect(result).toEqual({ username: data.username, token });
    expect(GoogleUser.create).toHaveBeenCalledWith({
      username: data.username,
      email: data.email
    });
    expect(createToken).toHaveBeenCalledWith({
      username: data.username,
      email: data.email
    });
  });

  test('checkUser', async () => {
    const data = { email: 'test@example.com', password: 'test' };
    const user = { username: 'test' };
    const token = 'testToken';
    (User.findOne as jest.Mock).mockResolvedValueOnce(user);
    (createToken as jest.Mock).mockReturnValueOnce(token);

    const result = await linkService.checkUser(data);

    expect(result).toEqual({ username: user.username, token });
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: data.email, password: data.password }
    });
    expect(createToken).toHaveBeenCalledWith({
      email: data.email,
      password: data.password
    });
  });

  test('checkGoogleUser', async () => {
    const data = { username: 'test', email: 'test@example.com' };
    const user = { username: 'test' };
    const token = 'testToken';
    (GoogleUser.findOne as jest.Mock).mockResolvedValueOnce(user);
    (createToken as jest.Mock).mockReturnValueOnce(token);

    const result = await linkService.checkGoogleUser(data);

    expect(result).toEqual({ username: user.username, token });
    expect(GoogleUser.findOne).toHaveBeenCalledWith({
      where: { username: data.username, email: data.email }
    });
    expect(createToken).toHaveBeenCalledWith(data.username, data.email);
  });

  test('addGoogleUser throws error', async () => {
    const data = { username: 'test', email: 'test@example.com' };
    (GoogleUser.create as jest.Mock).mockRejectedValueOnce(
      new Error('Test error')
    );

    await expect(linkService.addGoogleUser(data)).rejects.toThrow('Test error');
    expect(GoogleUser.create).toHaveBeenCalledWith({
      username: data.username,
      email: data.email
    });
  });

  test('shrinkUrl success', async () => {
    const data = { url: 'http://example.com' };
    const shrinkedUrl = { result_url: 'http://shrinked.com' };
    (shrinkLink as jest.Mock).mockResolvedValueOnce(shrinkedUrl);

    const result = await linkService.shrinkUrl({url: data.url});

    expect(result).toEqual(shrinkedUrl.result_url);
    expect(shrinkLink).toHaveBeenCalledWith({ url: data.url });
  });

  test('shrinkUrl failure', async () => {
    const data = { url: 'http://example.com' };
    (shrinkLink as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

    await expect(linkService.shrinkUrl({ url: data.url })).rejects.toThrow(
      'Test error'
    );
    expect(shrinkLink).toHaveBeenCalledWith({ url: data.url });
  });

  test('shrinkUrl handles error', async () => {
    const data = { url: 'http://example.com' };
    (shrinkLink as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

    await expect(linkService.shrinkUrl({ url: data.url})).rejects.toThrow('Test error');
    expect(shrinkLink).toHaveBeenCalledWith({ url: data.url });
  });
});
