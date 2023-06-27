import { Router } from 'express';
import ShortenerController from '../controllers/views-controllers/shortener.controller';

const Analytics = Router();

Analytics.get('/:id', ShortenerController.Analytics);

export default Analytics;
