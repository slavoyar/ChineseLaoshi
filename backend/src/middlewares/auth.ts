import { userRepository } from '@repositories';
import type { NextFunction, Request, Response } from 'express';

const DEFAULT_USER_EMAIL = process.env.DEFAULT_USER_EMAIL ?? 'slavoyar@mail.com';

export const defaultUserMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const user = await userRepository.getByEmail(DEFAULT_USER_EMAIL);
  req.user = { id: user.id, username: user.username };
  next();
};
