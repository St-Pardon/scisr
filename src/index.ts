import { PORT } from './config/env.config';
import app from './app';
import { ConnectToDB } from './config/db.config';
import redisClient from './config/redis.config';

// redisClient.isAlive();
redisClient.connect();
ConnectToDB();

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://127.0.0.1:${PORT}`);
});
