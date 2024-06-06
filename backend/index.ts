import express from 'express';
import routes from './src/routes';
import passport from './src/configs/passport';
import session from 'express-session';

const app = express();
const port = 3000;


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