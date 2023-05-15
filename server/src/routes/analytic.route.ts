import { Router, Request, Response } from 'express';
import urlModel from '../models/url.model';

const Analytics = Router();

Analytics.get(
  '/:user_id/url',
  async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const urls = await urlModel.find({ user_id });

    console.log(urls);

    res.status(200).json(urls);
  }
).get('/analytics/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const urls = await urlModel.findById({ _id: id });

  console.log(urls);

  res.status(200).json(urls);
});

export default Analytics;
