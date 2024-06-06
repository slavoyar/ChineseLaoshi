import express from 'express';
import { getRoutes } from './src/routes';
import { getPassport } from './src/configs/passport';
import { PrismaClient } from '@prisma/client';
import session from 'express-session';

const app = express();
const port = 3000;

const prisma = new PrismaClient()
const passport = getPassport(prisma);
const routes = getRoutes(prisma);

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});