import { CustomError } from '@configs/errors';
import passport from '@configs/passport';
import { CreateUserDto } from '@dtos';
import { userService } from '@services';
import { emailService } from '@services/emailService';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const { JWT_SECRET_KEY } = process.env;

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
  req: Request<void, void, CreateUserDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userService.createUser({ username, email, password: hashedPassword });
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

export const resetPassword = async (req: Request<void, void, { email: string }>, res: Response) => {
  const { email } = req.body;
  await emailService.resetPassword(email);
  res.sendStatus(200);
};

export const updatePassword = async (
  req: Request<void, void, { token: string; password: string }>,
  res: Response,
) => {
  const { token, password } = req.body;
  const { payload } = verify(token, JWT_SECRET_KEY, { complete: true });
  if (typeof payload === 'string') {
    throw new CustomError('entityUpdateError');
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await userService.updatePassword(payload.userId, hashedPassword);
  res.sendStatus(200);
};
