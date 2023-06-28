import express, { Application } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import indexRoute from './routes/index.route';
import './middlewares/passport.middleware';
import { limiter } from './middlewares/limiter.middleware';
import { errHandler } from './middlewares/error.middleware';
import { JWT_SECRET } from './config/env.config';

const app: Application = express();

app
  .use(helmet())
  .use(limiter)
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(
    session({
      secret: JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60 * 60 * 1000 }
    })
  )
  .use(express.static('public'))
  .set('views', 'views')
  .set('view engine', 'ejs')
  .use(passport.initialize())
  .use(passport.session())
  .use(errHandler)
  .use(indexRoute);

export default app;
