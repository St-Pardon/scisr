import { Router } from 'express';
import passport from 'passport';

const Auth: Router = Router();

Auth.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
).get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect the user to the home page or any other desired route
    res.redirect('/');
  }
);

export default Auth;
