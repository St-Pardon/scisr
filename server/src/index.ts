import { PORT } from './config/env.config';
import app from './app';

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://127.0.0.1:${PORT}`);
});
