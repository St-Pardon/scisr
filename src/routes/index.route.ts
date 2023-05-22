import { Router } from 'express';
import Auth from './auth.route';
import Shortener from './shortener.route';
import Analytics from './analytic.route';
import APIRoute from '../api/index.api';

const indexRoute: Router = Router();

indexRoute
  .use('/', Shortener)
  .use('/auth', Auth)
  .use('/analytics', Analytics)
  .use('/api', APIRoute);

export default indexRoute;
