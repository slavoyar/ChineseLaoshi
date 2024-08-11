import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';

import passport from './configs/passport';
import routes from './routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) ?? 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
