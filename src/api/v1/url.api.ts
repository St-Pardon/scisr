import { Router } from 'express';
import URLController from '../../controllers/api-controllers/url.controller';
import passport from 'passport';
import { UrlCache } from '../../middlewares/caching.middleware';

const UrlRoute = Router();

UrlRoute.get(
  '/history',
  passport.authenticate('jwt', { session: false }),
  URLController.getURL
)
  .get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    UrlCache,
    URLController.getById
  )
  .post(
    '/',
    passport.authenticate(['jwt', 'anonymous']),
    URLController.shortenURL
  )
  .delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    UrlCache,
    URLController.deleteById
  );

export default UrlRoute;
