import { toDataURL } from 'qrcode';

/**
 * Gereates QRcode with provided link
 * @param url - url of address to generate QRCode for
 * @returns
 */
export const generateQR = async (url: string): Promise<string> => {
  return await toDataURL(url);
};
