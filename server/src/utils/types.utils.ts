export interface urldb {
  originalUrl?: string;
  shortenUrl?: string;
  qrcode?: string;
}

export interface urldbs extends Array<urldb>{}