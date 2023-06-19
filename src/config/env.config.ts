import dotenv from 'dotenv';
dotenv.config();

export const RedisURI: string = process.env.REDIS_URI || 'redis://default:null@127.0.0.1:6379'

export const PORT: string = process.env.PORT || '5045';
export const MONGO_URI: string = process.env.MONGODB_URI || '';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'abcdefgh'; 
export const ROOT_URL: string = process.env.ROOT_URL || `http://127.0.0.1:${PORT}`; 
export const CALLBACK: string = process.env.CALLBACK || 'http://127.0.0.1:5353/auth/google/callback'

export const secret: string = process.env.GITHUB_AUTH_SECRET || '';
export const baseURL: string = process.env.GITHUB_AUTH_BASE_URL || '';
export const clientID: string = process.env.GITHUB_AUTH_CLIENT_ID || '';
export const issuerBaseURL: string =
  process.env.GITHUB_AUTH_ISSUER_BASE_URL || 'https://github.com';

export const googleSecret: string = process.env.GOOGLE_AUTH_SECRET || '';
export const googleBaseURL: string = process.env.GOOGLE_AUTH_BASE_URL || '';
export const googleClientID: string = process.env.GOOGLE_AUTH_CLIENT_ID || '';
export const googleIssuerBaseURL: string =
  process.env.GOOGLE_AUTH_ISSUER_BASE_URL || '';
