import { prisma } from '@configs/prisma';
import { CustomRequest } from '@models';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import passport from '../configs/passport';
import { userService } from '@services';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) ?? 10;

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    (err: unknown, user: Express.User, info: Record<string, string>) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }
      req.logIn(user, (error) => {
        if (error) {
          return next(error);
        }
        return res.json({ message: 'Login successful' });
      });
    },
  )(req, res, next);
};

export const register = async (
  req: CustomRequest<{ username: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userService.createUser({ username, password: hashedPassword });
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.json({ message: 'Registration is successful' });
    });
  } catch (error) {
    next(error);
  }
};
