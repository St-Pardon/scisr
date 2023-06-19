import { NextFunction, Request, Response } from 'express';
import redisClient from '../config/redis.config';

export const UrlCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  const cacheKey = `url:${id}`;
  const cachedOrder = await redisClient.get(cacheKey);

  if (cachedOrder) {
    // If item is already cached
    res.json({ status: true, order: JSON.parse(cachedOrder) });
    return;
  }
console.log('did not find cached item')
  // If item is not cached
  next();
};
