import { CALLBACK, googleClientID, googleSecret } from './env.config';

export const config = {
  clientID: googleClientID,
  clientSecret: googleSecret,
  callbackURL: CALLBACK,
  scope: ['openid', 'email', 'profile'],
};
