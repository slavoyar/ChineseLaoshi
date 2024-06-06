import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient } from '@prisma/client'; // Adjust the import path as per your project structure

export const getPassport = (prisma: PrismaClient) => {
  passport.use(new LocalStrategy(
    async (username: string, password: string, done) => {
      try {
        const user = await prisma.user.findFirst({ where: { username } });

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        if (!(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    // @ts-ignore
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  return passport;
}
