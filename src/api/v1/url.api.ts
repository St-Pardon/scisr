import { Router } from 'express';
import URLController from '../../controllers/url.controller';
import passport from 'passport';

const UrlRoute = Router();

UrlRoute.get('/', passport.authenticate('jwt', { session: false }), URLController.getURL).get('/:id').get('/history').post('/').delete('/:url_id');

export default UrlRoute