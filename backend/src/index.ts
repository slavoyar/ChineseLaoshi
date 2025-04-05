import 'express-async-errors';

import { errorMiddleware, loggerMiddleware } from '@middlewares';
import dotenv from 'dotenv';
import express from 'express';

import routes from './routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT);

app.use(loggerMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', routes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
