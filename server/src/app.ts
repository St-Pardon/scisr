import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import randomStr from './utils/random-str.utils';
import { urldb } from './utils/types.utils';

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
  .post('/', (req: Request, res: Response): void => {
    const { url, phrase } = req.body;

    if (!url) {
      res.json({ err: 'Please provide a url' });
      return;
    }
    const str: string = randomStr();

    db.push({ originalUrl: url, shortenUrl: str });
    res.status(201).send(db);
  })
  .get('/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    console.log(db)
    const idx: number = db.findIndex((x) => x.shortenUrl === id);
    console.log(id, idx)

    if (idx < 0) {
      res.status(404).json({ err: 'url not found' });
      return;
    }

    const url:any = db[idx].originalUrl
    res.status(302)
    res.setHeader('Location', url)
    res.end()
  });

export default app;
