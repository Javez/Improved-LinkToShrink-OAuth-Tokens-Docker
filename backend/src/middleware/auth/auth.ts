import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = 'mysecretkey';

export const createToken = (email: string, password: string): string => {
  const token = jwt.sign({ email, password }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp <= now) {
        return res.status(401).json({ message: 'Token expired' });
      }
      req.body.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: 'Token not found' });
  }
};
