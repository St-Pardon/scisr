import { createClient } from 'redis';
import { RedisURI } from './env.config';

class RedisClient {
  client: any;

  constructor() {
    this.client = null;
  }

  async connect() {
    try {
      this.client = createClient({ url: RedisURI });

      this.client.connect();

      this.client.on('connect', () => {
        console.log('Redis connected');
      });

      this.client.on('error', () => {
        console.log('Redis connection error');
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Retrieves item from cache
   * @param key - key of item to be retrieved
   * @returns
   */
  async get(key: string) {
    return this.client.get(key);
  }

  /**
   * Sets item to cache
   * @param key - key of item to set
   * @param value - value of item to set
   * @param dur - duration for item to expire
   */
  async set(key: string, value: any, dur: any) {
    return this.client.set(key, value, 'EX', dur);
  }

  /**
   * Deletes item from cache
   * @param key - key of item to be retrieved
   * @returns
   */
  async del(key: string) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
