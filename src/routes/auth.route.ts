import { Request, Response, Router } from 'express';
import passport from 'passport';
import AuthController from '../controllers/views-controllers/auth.controller';

const Auth: Router = Router();

Auth.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
)
  .get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    (req: Request, res: Response): void => {
      res.redirect('/');
    }
  )
  .get('/login', (req: Request, res: Response): void => {
    res.status(200).render('login', { error: '' });
  })
  .get('/signup', (req: Request, res: Response): void => {
    res.status(200).render('signup', { error: '' });
  })
  .post('/login', AuthController.signin)
  .post('/signup', AuthController.signup)
  .get('/logout', AuthController.logout);

export default Auth;
