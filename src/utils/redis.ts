import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  client: any;
  redisAlive: boolean;

  constructor() {
    this.client = createClient();
    this.redisAlive = true;
    this.client.on('error', (err: any) => {
      console.log(`Redis client not connected to the server:  ${err}`);
      this.redisAlive = false;
    });
    this.client.on('connect', () => {
      this.redisAlive = true;
    });
  }

  isAlive() {
    return this.redisAlive;
  }

  async get(key: string) {
    return promisify(this.client.get).bind(this.client)(key);
  }

  async set(key: string, value: any, dur: any) {
    promisify(this.client.setex).bind(this.client)(key, dur, value);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
