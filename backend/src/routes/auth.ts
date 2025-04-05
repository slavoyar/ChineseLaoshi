import { createValidationMiddleware } from '@middlewares';
import { User } from '@prisma/client';
import { emailService, userService } from '@services';
import {
  CreateUserSchema,
  LoginSchema,
  ResetPasswordDto,
  ResetPasswordSchema,
  UpdatePasswordSchema,
} from '@shared/schemas';
import { Response } from 'express';

import { createRouter, Ok, type Params } from './createRouter';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const { router, createRoute } = createRouter('/auth');

const loginMiddleware = createValidationMiddleware(LoginSchema);
const registerMiddleware = createValidationMiddleware(CreateUserSchema);
const updatePasswordMiddleware = createValidationMiddleware(UpdatePasswordSchema);

router.post('/auth/login', loginMiddleware, async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.getUserByCredentials(username, password);
  setTokenCookies(res, user);
});

router.post('/auth/register', registerMiddleware, async (req, res) => {
  const user = await userService.createUser(req.body);
  setTokenCookies(res, user);
});

router.post('/auth/update-password', updatePasswordMiddleware, async (req, res) => {
  const { token, password } = req.body;
  const user = await userService.updatePassword(token, password);
  setTokenCookies(res, user);
});

router.post('/auth/logout', async (_, res) => {
  res.clearCookie('accessToken').clearCookie('refreshToken').sendStatus(200);
});

router.post('/auth/refresh-token', async (req, res) => {
  const { refreshToken } = req.cookies;
  const user = await userService.refreshToken(refreshToken);
  setTokenCookies(res, user);
});

createRoute<Params, ResetPasswordDto>(
  async (req) => {
    const { email } = req.body;
    await emailService.resetPassword(email);
    return Ok();
  },
  {
    method: 'post',
    endpoint: '/reset-password',
    schema: ResetPasswordSchema,
  }
);

const setTokenCookies = (res: Response, user: User) => {
  const tokenPair = userService.createTokenPair(user);
  res
    .cookie('accessToken', tokenPair.accessToken, { httpOnly: true, secure: IS_PRODUCTION })
    .cookie('refreshToken', tokenPair.refreshToken, { httpOnly: true, secure: IS_PRODUCTION })
    .sendStatus(200);
};

export default router;
