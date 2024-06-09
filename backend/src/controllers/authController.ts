import { NextFunction, Request, Response } from 'express';

import passport from '../configs/passport';

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
