import { Document } from "mongoose";

export interface urldb {
  originalUrl?: string;
  shortenUrl?: string;
  qrcode?: string;
}

export interface urldbs extends Array<urldb>{}

export interface authConfig {
  authRequired?: boolean,
  auth0Logout?: boolean,
  secret: string;
  baseURL: string;
  clientID: string;
  issuerBaseURL: string;
  authorizationParams: {
    [scope: string]: string
  },
}

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  photo: string;
  provider: string;
  provider_id: string;
  isValidPassword(password: string): Promise<boolean>;
}

export interface IURL extends Document {
  created_at: Date;
  updated_at: Date;
  user_id: string;
  original_url: string;
  shortened_url: string;
  qrcode: string;
  clicks: number;
  location?: string;
  client?: string;
  moment?: string;
}

export interface IURLArray extends Array<IURL> {}

declare module 'mongoose' {
  interface ConnectOptions {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
  }
}