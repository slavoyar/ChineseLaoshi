import { Request } from 'express';

export type CustomRequest<Res = any, Req = any> = Request<Record<string, string>, Res, Req>;
