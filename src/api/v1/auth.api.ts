import { Router } from 'express';
import AuthController from '../../controllers/api-controllers/auth.controller';

const AuthAPI = Router();

AuthAPI.post('/signin', AuthController.signin).post(
  '/signup',
  AuthController.signup
);

export default AuthAPI;
