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
}