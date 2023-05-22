import { googleClientID, googleSecret } from './env.config';

export const config = {
  clientID: googleClientID,
  clientSecret: googleSecret,
  callbackURL: 'http://127.0.0.1:5353/auth/google/callback',
  scope: ['openid', 'email', 'profile'],
};
