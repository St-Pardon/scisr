import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import urlModel from '../../models/url.model';
import isValidUrl from '../../utils/validate-url.utils';
import randomStr from '../../utils/random-str.utils';
import { generateQR } from '../../utils/generateQR.utils';
import { ROOT_URL } from '../../config/env.config';
import redisClient from '../../config/redis.config';

class URLController {
  /**
   * get all url for an authenticated user
   * @param req
   * @param res
   * @returns null
   */
  static async getURL(
    req: Request & { user?: any },
    res: Response
  ): Promise<void> {
    const { email } = req.user;

    const url = await urlModel.find({ user_id: email });
    if (!url) {
      res.status(404).json({ err: 'User have not shortened an url' });
      return;
    }

    res.status(200).send(url);
  }

  /**
   * get a single url by it id
   * @param req
   * @param res
   * @returns
   */
  static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      res.status(400).json({ err: 'invalid id' });
      return;
    }

    const url = await urlModel.findOne({ _id: id });

    const cacheKey = `url:${id}`;
    redisClient.set(cacheKey, JSON.stringify(url), 60 * 60);

    if (!url) {
      res.status(404).json({ err: 'url not found' });
      return;
    }

    res.status(200).send(url);
  }

  /**
   * delete a single url by it id
   * @param req
   * @param res
   * @returns
   */
  static async deleteById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const cacheKey = `url:${id}`;

    if (!id || !isValidObjectId(id)) {
      res.status(400).json({ err: 'invalid id' });
      return;
    }

    await urlModel.deleteOne({ _id: id });

    redisClient.del(cacheKey);

    res.status(200).send('url deleted');
  }

  /**
   * shortens url
   * @param req
   * @param res
   * @param next
   * @returns
   */
  static async shortenURL(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { original_url, custom: phrase } = req.body;
    let urlExist;

    if (!original_url) {
      res.status(400).json({ err: 'Please provide a url' });
      return;
    }
    if (!isValidUrl(original_url)) {
      res
        .status(400)
        .json({
          err: 'Invalid URL, Try Again with a valid url e.g https://google.com',
        });
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
      res.status(200).send({
        original_url: urlExist.original_url,
        shortened_url: urlExist.shortened_url,
        qrcode: urlExist.qrcode,
      });
      return;
    }

    const data = await urlModel.create({
      user_id: req.user ? req.user.email : '',
      original_url,
      shortened_url: `${ROOT_URL}/${shorten_code}`,
      qrcode,
    });

    res.status(201).send(data);
  }

  /**
   * redirects users to the original url
   * @param req
   * @param res
   * @returns
   */
  static async redirectURL(req: Request, res: Response): Promise<void> {
    const { shorten_url } = req.params;
    const url = await urlModel.findOne({
      shortened_url: `${ROOT_URL}/${shorten_url}`,
    });

    if (!url) {
      res.status(404).json({ err: 'url not found' });
      return;
    }

    // this route is not cached becasue caching would prevent updatinng the click count
    url.clicks = url.clicks + 1;
    await url.save();

    res.status(302);
    res.setHeader('Location', url.original_url);
    res.end();
  }
}

export default URLController;
