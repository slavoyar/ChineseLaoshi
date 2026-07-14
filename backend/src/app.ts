import 'express-async-errors';

import { defaultUserMiddleware, errorMiddleware, loggerMiddleware } from '@middlewares';
import dotenv from 'dotenv';
import express from 'express';

import routes from './routes';

dotenv.config();

const app = express();

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV !== 'test') {
  app.use(loggerMiddleware);
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(defaultUserMiddleware);

app.use('/api', routes);

app.use(errorMiddleware);

export default app;
