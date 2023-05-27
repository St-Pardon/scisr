import { Router, Request, Response } from 'express';
import urlModel from '../models/url.model';

const Analytics = Router();

Analytics.get(
  '/:id',
  async (req: Request & { user?: any }, res: Response): Promise<void> => {
    const { id } = req.params;

    const urlData = await urlModel.findById({ _id: id });

    if (!urlData) {
      res.status(404).json({ err: 'url not found' });
    }

    res.status(200).render('analytic', {
      url: {
        res: {urlData},
        user: req.user
          ? {
              email: req.user?.email,
              name: `${req.user?.first_name} ${req.user?.last_name}`,
              dp: req.user?.photo,
            }
          : '',
      },
    });
  }
);

export default Analytics;
