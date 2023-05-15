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