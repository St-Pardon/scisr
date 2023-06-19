import { Router } from 'express';
import URLController from '../controllers/api-controllers/url.controller';
import ShortenerController from '../controllers/views-controllers/shortener.conntroller';

const Shortener = Router();

Shortener.get('', ShortenerController.getHistory)
  .post('', ShortenerController.shortenLink)
  .get('/:shorten_url', URLController.redirectURL);

export default Shortener;
