import type { Request, Response, NextFunction } from "express";

/**
 * Authentication middleware.
 * Checks for Bearer token in Authorization header when AUTH_ENABLED=true.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (process.env.AUTH_ENABLED !== "true") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Missing or invalid Authorization header. Expected: Bearer <token>",
    });
    return;
  }

  const token = authHeader.slice(7);
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    console.error("AUTH_ENABLED is true but API_KEY is not set");
    res.status(500).json({
      error: "Internal Server Error",
      message: "Authentication is misconfigured",
    });
    return;
  }

  if (token !== expectedKey) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid API key",
    });
    return;
  }

  next();
}