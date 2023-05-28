import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000, 
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
})