import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import passport from '../configs/passport';
import { getPrisma } from '../configs/prisma/prismaInjection';
import { CustomRequest } from '../models';

const prisma = getPrisma();

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
    const user = await prisma.user.create({ data: { username, password: hashedPassword } });
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.json({ message: 'Registration is successful' });
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      // Unique constraint failed error
      res.status(409).json({ message: 'Register error. This login is already registered' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
