import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 requests per window per IP
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,     // returns rate limit info in headers
  legacyHeaders: false,
});