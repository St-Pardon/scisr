import { Router } from 'express';
import URLController from '../../controllers/url.controller';
import passport from 'passport';

const UrlRoute = Router();

UrlRoute.get('/:id', URLController.getById)
  .get(
    '/history',
    passport.authenticate('jwt', { session: false }),
    URLController.getURL
  )
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
