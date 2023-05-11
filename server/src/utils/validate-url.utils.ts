function isValidUrl(str: string): boolean {
  const urlPattern = new RegExp('^(ftp|http|https)://[^ "]+$');

  return urlPattern.test(str);
}

export default isValidUrl;
