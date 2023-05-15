import { Router, Request, Response } from 'express';
import isValidUrl from '../utils/validate-url.utils';
import randomStr from '../utils/random-str.utils';
import { generateQR } from '../utils/generateQR.utils';
import urlModel from '../models/url.model';

const Shortener = Router();

Shortener.get('', (req: Request & { user?: any }, res: Response): void => {
  res
    .status(200)
    .send(
      `Welcome to scisr ${
        req.user.email === undefined ? '' : req.user.email
      }, the leading url shortnening applications`
    );
}).post(
  '',
  async (req: Request & { user?: any }, res: Response): Promise<void> => {
    console.log(req.user);
    const { original_url, phrase, user_id } = req.body;

    if (!original_url) {
      res.status(400).json({ err: 'Please provide a url' });
      return;
    }

    if (!isValidUrl(original_url)) {
      res.status(400).json({ err: 'Invalid URL, Try Again' });
      return;
    }

    const shorten_code: string = phrase.toLowerCase() || randomStr();
    const qrcode: string = await generateQR(
      `http:127.0.0.1:5353/${shorten_code}`
    );

    if (user_id) {
      await urlModel.create({
        original_url,
        shortened_url: `http:127.0.0.1:5353/${shorten_code}`,
        qrcode,
      });
    }
    // db.push({ originalUrl: url, shortenUrl: str, qrcode: qrcode });
    res.status(201).json({
      original_url,
      shortened_url: `http:127.0.0.1:5353/${shorten_code}`,
      qrcode,
    });
  }
).get(':shorten_url', async (req: Request, res: Response): Promise<void> => {
    const { shorten_url } = req.params;
    const url = await urlModel.findOne({ shorten_url: shorten_url });

    if (!url) {
      res.status(404).json({ err: 'url not found' });
      return;
    }

    url.clicks = url.clicks + 1;
    await url.save();

    res.status(302);
    res.setHeader('Location', url.original_url);
    res.end();
  })

export default Shortener;
