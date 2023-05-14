import dotenv from 'dotenv';
dotenv.config();

export const PORT: string = process.env.PORT || '5045';
export const MONGO_URI: string = process.env.MONGODB_URI || '';