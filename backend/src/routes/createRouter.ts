import { validationMiddleware } from '@middlewares';
import { type Request, Router } from 'express';

export type Params = Record<string, string>;

export type ControllerResult<T> = {
  status: number;
  data?: T;
};

type SuccessResponse<T> = ControllerResult<T> & { status: 200 };

export const Ok = <T>(data?: T): SuccessResponse<T> => ({ status: 200, data });

export function createRouter(url: string) {
  const router = Router();
  function createRoute<Parameters extends Params, Body = unknown, Result = unknown, Query = Params>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    cb: (req: Request<Parameters, Result, Body, Query>) => Promise<ControllerResult<Result>>
  ) {
    router[method](url + endpoint, validationMiddleware<Body>, async (req, res) => {
      try {
        const result = await cb(req as Request<Parameters, Result, Body, Query>);
        return res.status(result.status).json(result.data);
      } catch (error) {
        return res.status(500).json(error);
      }
    });
  }
  return { router, createRoute };
}
