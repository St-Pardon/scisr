import { Router, Request, Response } from 'express';
import isValidUrl from '../utils/validate-url.utils';
import randomStr from '../utils/random-str.utils';
import { generateQR } from '../utils/generateQR.utils';
import urlModel from '../models/url.model';
import { IURLArray } from '../utils/types.utils';
import moment from 'moment';

const Shortener = Router();

Shortener.get(
  '',
  async (req: Request & { user?: any }, res: Response): Promise<void> => {
    let data: IURLArray = [];

    if (req.user) {
      data = await urlModel.find({ user_id: req.user?.email }).exec();
    }

    // change creation date to moment 
    const history = data.map((item) => ({
      ...item,
      moment: moment(item.created_at).fromNow(),
    }));

    res.status(200).render('index', {
      url: {
        user: req.user
          ? {
              email: req.user?.email,
              name: `${req.user?.first_name} ${req.user.last_name}`,
              dp: req.user?.photo,
            }
          : '',
        history,
      },
    });
  }
)
  .post(
    '',
    async (req: Request & { user?: any }, res: Response): Promise<void> => {
      const { original_url, phrase } = req.body;

      if (!original_url) {
        res.status(400).json({ err: 'Please provide a url' });
        return;
      }

      if (!isValidUrl(original_url)) {
        res.status(400).json({ err: 'Invalid URL, Try Again' });
        return;
      }

      const shorten_code: string = phrase ? phrase.toLowerCase() : randomStr();
      const qrcode: string = await generateQR(
        `http://127.0.0.1:5353/${shorten_code}`
      );

      if (req.user?.email) {
        const urlExist = await urlModel.findOne({
          original_url,
          user_id: req.user.email,
        });

        if (!urlExist) {
          await urlModel.create({
            user_id: req.user.email,
            original_url,
            shortened_url: `http://127.0.0.1:5353/${shorten_code}`,
            qrcode,
          });
        }
      }
      res.status(201).render('index', {
        url: {
          res: {
            original_url,
            shortened_url: `http://127.0.0.1:5353/${shorten_code}`,
            qrcode,
          },
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
  )
  .get('/:shorten_url', async (req: Request, res: Response): Promise<void> => {
    const { shorten_url } = req.params;
    const url = await urlModel.findOne({
      shortened_url: `http://127.0.0.1:5353/${shorten_url}`,
    });

    if (!url) {
      res.status(404).json({ err: 'url not found' });
      return;
    }

    url.clicks = url.clicks + 1;
    await url.save();

    res.status(302);
    res.setHeader('Location', url.original_url);
    res.end();
  });

export default Shortener;
