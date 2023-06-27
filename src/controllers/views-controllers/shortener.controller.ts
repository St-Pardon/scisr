import { NextFunction, Request, Response } from 'express';
import { IURLArray } from '../../utils/types.utils';
import urlModel from '../../models/url.model';
import moment from 'moment';
import isValidUrl from '../../utils/validate-url.utils';
import randomStr from '../../utils/random-str.utils';
import { generateQR } from '../../utils/generateQR.utils';
import { ROOT_URL } from '../../config/env.config';

class ShortenerController {
  /**
   * get shortener url history for a user
   * @param req - request object
   * @param res - response object
   * @param next - next function
   */
  static async Analytics(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    const urlData = await urlModel.findById({ _id: id });

    if (!urlData) {
      res.status(404).json({ err: 'url not found' });
    }

    res.status(200).render('analytic', {
      url: {
        res: { urlData },
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

  /**
   * get shortener url history for a user
   * @param req - request object
   * @param res - response object
   * @param next - next function
   */
  static async getHistory(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let data: IURLArray = [];

    if (req.user) {
      data = await urlModel.find({ user_id: req.user?.email }).exec();
    }

    const history = data
      .sort((x: any, y: any) => {
        const timestampX = new Date(x.created_at).getTime();
        const timestampY = new Date(y.created_at).getTime();

        return timestampY - timestampX;
      })
      .map((item) => ({
        ...item,
        // change creation date to moment
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

  /**
   * shortens a url for authenticated and non-authenticated users
   * @param req - request object
   * @param res - response object
   * @param next - next function
   */
  static async shortenLink(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { original_url, phrase } = req.body;
    let urlExist;

    if (!original_url) {
      res.status(400).json({ err: 'Please provide a url' });
      return;
    }

    if (!isValidUrl(original_url)) {
      res.status(400).json({ err: 'Invalid URL, Try Again' });
      return;
    }

    const shorten_code: string = phrase ? phrase.toLowerCase() : randomStr();
    const qrcode: string = await generateQR(`${ROOT_URL}/${shorten_code}`);

    if (req.user?.email) {
      urlExist = await urlModel.findOne({
        original_url,
        user_id: req.user.email,
      });
    }

    if (urlExist) {
      res.status(201).render('index', {
        url: {
          res: {
            original_url: urlExist.original_url,
            shortened_url: urlExist.shortened_url,
            qrcode: urlExist.qrcode,
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
      return;
    }

    await urlModel.create({
      user_id: req.user ? req.user.email : '',
      original_url,
      shortened_url: `${ROOT_URL}/${shorten_code}`,
      qrcode,
    });

    res.status(201).render('index', {
      url: {
        res: {
          original_url,
          shortened_url: `${ROOT_URL}/${shorten_code}`,
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
}

export default ShortenerController;
