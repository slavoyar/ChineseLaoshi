import chalk from 'chalk';
import type { NextFunction, Request, Response } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  const originalSend = res.send;

  res.send = (...args) => {
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    const methodColor = chalk.blue(req.method);
    const urlColor = chalk.green(req.url);
    const statusColor =
      res.statusCode >= 400 ? chalk.red(res.statusCode.toString()) : chalk.yellow(res.statusCode.toString());
    const timeColor = chalk.magenta(`${elapsedTime}ms`);

    console.log(`[${new Date().toISOString()}] ${methodColor} ${urlColor} ${statusColor} - ${timeColor}`);

    return originalSend.apply(res, args);
  };

  next();
};
