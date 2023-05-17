import { Router } from 'express';
import passport from 'passport';

const Auth: Router = Router();

Auth.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
).get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect the user to the home page or any other desired route
    res.redirect('/success');
  }
);

export default Auth;