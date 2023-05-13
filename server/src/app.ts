import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import randomStr from './utils/random-str.utils';
import { urldb } from './utils/types.utils';
import isValidUrl from './utils/validate-url.utils';
import { generateQR } from './utils/generateQR.utils';

const app: Application = express();
const db: urldb[] = [];

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .get('/', (req: Request, res: Response): void => {
    res
      .status(200)
      .send('Welcome to scisr, the leading urlshortnening applications');
  })
  .post('/', async (req: Request, res: Response): Promise<void> => {
    const { url, phrase } = req.body;

    if (!url) {
      res.status(400).json({ err: 'Please provide a url' });
      return;
    }

    if (!isValidUrl(url)) {
      res.status(400).json({ err: 'Invalid URL, Try Again' });
      return;
    }

    const str: string = phrase.toLowerCase() || randomStr();
    // const qrcode =
    const qrcode: string = await generateQR(`http:127.0.0.1:5353/${str}`);

    db.push({ originalUrl: url, shortenUrl: str, qrcode: qrcode });
    res.status(201).send(db);
  })
  .get('/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    console.log(db);
    const idx: number = db.findIndex((x) => x.shortenUrl === id);
    console.log(id, idx);

    if (idx < 0) {
      res.status(404).json({ err: 'url not found' });
      return;
    }

    const url: any = db[idx].originalUrl;
    res.status(302);
    res.setHeader('Location', url);
    res.end();
  });

export default app;
