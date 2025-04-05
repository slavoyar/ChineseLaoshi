import type { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { CustomUser } from 'types/express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.clearCookie('accessToken').status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export const setUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies && req.cookies.accessToken) {
    const user = verify(req.cookies.accessToken, process.env.JWT_SECRET_KEY, { complete: true });
    if (typeof user === 'string') {
      return res.clearCookie('accessToken').status(401).json({ message: 'Unauthorized' });
    }
    req.user = user.payload as CustomUser;
  }
  next();
};
