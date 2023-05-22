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
      // Redirect the user to the home page or any other desired route
      res.redirect('/');
    }
  )
  .get('/login', (req: Request, res: Response): void => {
    res.status(200).render('login');
  })
  // .get('/success', (req: Request & { user?: any }, res: Response) => {
  //   // console.log(req.user);
  //   res.render('index', {
  //     url: {
  //       user: {
  //         email: req.user?.email,
  //         name: `${req.user?.first_name} ${req.user.last_name}`,
  //         dp: req.user?.photo,
  //       },
  //     },
  //   });
  // });

export default Auth;
