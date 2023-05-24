import { Router } from "express";

const AuthAPI = Router()

AuthAPI.post('/signin').post('/signup')

export default AuthAPI