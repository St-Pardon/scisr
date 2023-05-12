import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5045;
export const MONGO_URI = process.env.MONGODB_URI;
