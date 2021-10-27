import 'reflect-metadata';
import * as cookieSession from 'cookie-session';
import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';

function usePassport(app) {
  app.use(
    cookieSession({
      name: 'session',
      keys: ['session secret'],
      saveUninitialized: false,
      // Cookie Options
      resave: false,
      secure: false,
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }),
  );

  // Serialize Sessions
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize Sessions
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new Strategy(async (email, password, done) => {
      done(null, { email, password });
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}

export const Backend = {
  async init() {
    const app = await NestFactory.create(AppModule, {
      bodyParser: false,
    });

    usePassport(app);
    await app.init();
    await app.listen(config.port);
  }
};
