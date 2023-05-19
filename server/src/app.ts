import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import indexRoute from './routes/index.route';
import passport from 'passport';
import session from 'express-session';
import './middlewares/passport.middleware';

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
  .use(indexRoute)

  .get('/login', (req: Request, res: Response): void => {
    console.log(req.url);
    res.status(200).render('login');
  })
  .get('/success', (req: Request & { user?: any }, res: Response) => {
    console.log(req.user);
    res.send(`Welcome ${req.user?.email}`);
  });

export default app;
