import { Router } from 'express';
import Auth from './auth.route';
import Shortener from './shortener.route';
import Analytics from './analytic.route';

const indexRoute: Router = Router();

indexRoute.use('/', Shortener).use('/auth', Auth).use('/analytics', Analytics);

export default indexRoute;
