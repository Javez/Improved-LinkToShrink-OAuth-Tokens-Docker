// auth.test.ts
import jwt from 'jsonwebtoken';
import { createToken, verifyToken } from '../../src/middleware/auth/auth';
import { NextFunction, Request, Response } from 'express';

jest.mock('jsonwebtoken');

describe('auth', () => {
  test('createToken', () => {
    const email = 'test@example.com';
    const password = 'test';
    const mockToken = 'mockToken';
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const token = createToken(email, password);

    expect(token).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      { email, password },
      process.env.JWT_SECRET_KEY || '',
      { expiresIn: '1h' }
    );
  });

  test('verifyToken', () => {
    const mockReq = {
      headers: {
        authorization: 'Bearer mockToken'
      },
      body: {}
    } as unknown as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const mockNext: NextFunction = jest.fn();
    const mockDecoded = { exp: Math.floor(Date.now() / 1000) + 3600 };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) =>
      callback(null, mockDecoded)
    );

    verifyToken(mockReq, mockRes, mockNext);

    expect(mockReq.body.user).toEqual(mockDecoded);
    expect(mockNext).toHaveBeenCalled();
    expect(jwt.verify).toHaveBeenCalledWith(
      'mockToken',
      process.env.JWT_SECRET_KEY || '',
      expect.any(Function)
    );
  });
});
