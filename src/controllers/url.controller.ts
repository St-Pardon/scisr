import { NextFunction, Request, Response } from 'express';
import urlModel from '../models/url.model';
import passport from 'passport';
import isValidUrl from '../utils/validate-url.utils';
import randomStr from '../utils/random-str.utils';
import { generateQR } from '../utils/generateQR.utils';

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
      res.status(404).json({ err: 'User have not shortened url' });
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

    if (!id) {
      res.status(400).json({ err: 'invalid id' });
      return;
    }

    const url = await urlModel.findOne({ _id: id });

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

    if (!id) {
      res.status(400).json({ err: 'invalid id' });
      return;
    }

    await urlModel.deleteOne({ _id: id });

    res.status(200).send('url deleted');
  }

  static async shortenURL(
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
    const qrcode: string = await generateQR(
      `http://127.0.0.1:5353/${shorten_code}`
    );

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
      shortened_url: `http://127.0.0.1:5353/${shorten_code}`,
      qrcode,
    });

    res.status(201).send(data);
  }
}

export default URLController;
