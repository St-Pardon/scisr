import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
interface SessionData {
  user: any; // Replace 'any' with the actual type of your user data
}
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

  /**
   * logs a user out of the application
   * @param req 
   * @param res 
   */
  static logout(req: Request, res: Response): void {
    req.logout((err) => {
      if (err) {
        console.error(err);
        res.redirect('/');
        return;
      }
      res.redirect('/');
    });
  }
}

export default AuthController;
