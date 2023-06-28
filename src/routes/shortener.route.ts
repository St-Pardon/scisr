import { Router } from 'express';
import URLController from '../controllers/api-controllers/url.controller';
import ShortenerController from '../controllers/views-controllers/shortener.controller';

const Shortener = Router();

Shortener.get('', ShortenerController.getHistory)
  .post('', ShortenerController.shortenLink)
  .delete('/:url_id', ShortenerController.DeleteURL)
  .get('/:shorten_url', URLController.redirectURL);

export default Shortener;
