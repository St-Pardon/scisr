import { Request, Response, Router } from 'express';
import passport from 'passport';

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
    res.status(200).render('login');
  });

export default Auth;
