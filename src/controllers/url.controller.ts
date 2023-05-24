import { Request, Response } from 'express';
import urlModel from '../models/url.model';

class URLController {
  static async getURL(
    req: Request & { user?: any },
    res: Response
  ): Promise<void> {
    const { email } = req.user;

    const url = await urlModel.find({ user_id: email });
    if (!url) {
      res.status(404).json({ err: 'User have not shortened url' });
      return
    }

    res.status(200).send(url);
  }
}

export default URLController;
