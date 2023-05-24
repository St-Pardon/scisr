import { Router } from 'express';

const UrlRoute = Router();

UrlRoute.get('/').get('/:id').get('/history').post('/').delete('/:url_id');

export default UrlRoute