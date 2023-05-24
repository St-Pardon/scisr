import { Router } from "express";
import UrlRoute from "./v1/url.api";
import AuthAPI from "./v1/auth.api";

const APIRoute = Router()

APIRoute.use('/v1/url', UrlRoute).use('/v1/auth', AuthAPI)

export default APIRoute;