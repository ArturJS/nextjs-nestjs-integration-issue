import 'reflect-metadata';
import * as http from 'http';
import * as cookieSession from 'cookie-session';
import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { NextApiHandler } from 'next';
import { AppModule } from './app.module';

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

let app: INestApplication;
let appPromise: Promise<void>;

export const Backend = {
  async getApp() {
    if (app) {
      return app;
    }
  
    if (!appPromise) {
      appPromise = new Promise(async (resolve) => {
        const appInCreation = await NestFactory.create(AppModule, {
          bodyParser: false,
        });

        usePassport(appInCreation);
        console.log('################ App INITIALIZATION! ###########');
        await appInCreation.init();
        app = appInCreation;
        resolve();
      });
    }

    await appPromise;
    return app;
  },

  async getListener() {
    const app = await Backend.getApp();
    const server: http.Server = app.getHttpServer();
    const requestListeners = server.listeners('request') as NextApiHandler[];
    const [listener] = requestListeners;

    console.log({ // @ts-ignore
      'listener._router.stack': listener._router.stack
    })

    return listener;
  },
};