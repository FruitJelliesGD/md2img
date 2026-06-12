import { Router, type Request, type Response } from "express";

const startTime = Date.now();

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  });
});

export default router;
