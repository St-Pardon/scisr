import dotenv from 'dotenv'
import app from './app';
dotenv.config();

const PORT = process.env.PORT || 5045;

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://127.0.0.1:${PORT}`);
});
