import express from 'express';
import routes from './routes';
import passport from './configs/passport';
import session from 'express-session';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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