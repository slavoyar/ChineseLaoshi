import { CustomError } from '@configs/errors';
import passport from '@configs/passport';
import { emailService } from '@services/emailService';
import { userService } from '@services/userService';
import type { Email } from '@shared/common';
import type { CreateUserDto } from '@shared/schemas';
import bcrypt from 'bcryptjs';
import { verify } from 'jsonwebtoken';

import { createRouter, Ok, type Params } from './createRouter';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const { JWT_SECRET_KEY } = process.env;

const { router, createRoute } = createRouter('/auth');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err: unknown, user: Express.User, info: { message: string }) => {
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
  })(req, res, next);
});

createRoute<Params, CreateUserDto>(
  async (req) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userService.createUser({ username, email, password: hashedPassword });
    return new Promise((resolve, reject) => {
      req.logIn(user, (error) => {
        if (error) {
          reject(error);
        }
        resolve(Ok({ message: 'Registration is successful' }));
      });
    });
  },
  {
    method: 'post',
    endpoint: '/register',
  }
);

createRoute<Params, { email: Email }>(
  async (req) => {
    const { email } = req.body;
    await emailService.resetPassword(email);
    return Ok();
  },
  {
    method: 'post',
    endpoint: '/reset-password',
  }
);

createRoute<Params, { token: string; password: string }>(
  async (req) => {
    const { token, password } = req.body;
    const { payload } = verify(token, JWT_SECRET_KEY, { complete: true });
    if (typeof payload === 'string') {
      throw new CustomError('entityUpdateError');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userService.updatePassword(payload.userId, hashedPassword);

    return new Promise((resolve, reject) => {
      req.logIn(user, (error) => {
        if (error) {
          reject(error);
        }
        resolve(Ok({ message: 'Password changed' }));
      });
    });
  },
  {
    method: 'post',
    endpoint: '/update-password',
  }
);

export default router;
