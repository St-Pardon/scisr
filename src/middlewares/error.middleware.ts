import { NextFunction, Request, Response } from 'express';

const errHandler = function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
};

export { errHandler };
