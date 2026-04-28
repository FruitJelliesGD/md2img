import rateLimit from "express-rate-limit";

/**
 * Rate limiting middleware.
 * Only active when QUOTA_ENABLED=true.
 */
export function createRateLimiter() {
  if (process.env.QUOTA_ENABLED !== "true") {
    // Return a no-op middleware when rate limiting is disabled
    return (_req: any, _res: any, next: any) => next();
  }

  const max = parseInt(process.env.RATE_LIMIT_MAX || "60", 10);
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too Many Requests",
      message: `Rate limit exceeded. Max ${max} requests per ${windowMs / 1000} seconds.`,
    },
  });
}