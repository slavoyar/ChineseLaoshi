import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { getPrisma } from '../prisma/prismaInjection';

const prisma = getPrisma();

passport.use(
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { username } });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, { ...user, password: undefined });
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      done('User not found');
      return;
    }
    done(null, { id: user.id, username: user.username });
  } catch (err) {
    done(err);
  }
});
export default passport;
