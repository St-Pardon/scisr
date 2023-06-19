import express, { Application } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import indexRoute from './routes/index.route';
import './middlewares/passport.middleware';
import { limiter } from './middlewares/limiter.middleware';
import { errHandler } from './middlewares/error.middleware';

const app: Application = express();

app
  .use(helmet())
  .use(limiter)
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(
    session({
      secret: 'passport google',
      resave: false,
      saveUninitialized: false,
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
