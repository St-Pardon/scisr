import { Router } from 'express';
import URLController from '../../controllers/url.controller';
import passport from 'passport';

const UrlRoute = Router();

UrlRoute.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  URLController.getURL
)
  .get('/:id', URLController.getById)
  .post(
    '/',
    passport.authenticate(['jwt', 'anonymous']),
    URLController.shortenURL
  )
  .delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    URLController.deleteById
  );

export default UrlRoute;
