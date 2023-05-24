import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import indexRoute from './routes/index.route';
import passport from 'passport';
import session from 'express-session';
import './middlewares/passport.middleware';
import APIRoute from './api/index.api';

const app: Application = express();

app
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
  .use("/api", APIRoute)
  .use(indexRoute)
  

export default app;
