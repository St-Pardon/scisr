import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

class AuthController {
  /**
   * Authenticate user by signin
   * @param req
   * @param res
   * @param next
   */
  static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    passport.authenticate('signin', async (error: any, user: any) => {
      try {
        if (error) {
          res.render('login', { error });
          return;
        }
        if (!user) {
          const error = 'email or password is incorrect';
          res.render('login', { error });
          return;
        }
        req.login(user, { session: true }, async (error) => {
          if (error) return next(error);
          res.redirect('/');
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }

  /**
   * creates a new user account
   * @param req
   * @param res
   * @param next
   */
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    passport.authenticate('signup', async (error: any, user: any) => {
      if (error) {
        res.render('signup', { error });
        return;
      }
      if (!user) {
        res.render('signup', { error: 'User already exist' });
        return;
      }
      res.redirect('/auth/login');
    })(req, res, next);
  }
}

export default AuthController;
