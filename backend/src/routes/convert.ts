import { Router, type Request, type Response } from "express";
import { generateHTML } from "../utils/htmlTemplate";
import { takeScreenshot } from "../services/screenshot";

const router = Router();

interface ConvertRequest {
  markdown: string;
  theme?: "light" | "dark";
  format?: "png" | "jpeg" | "webp";
  width?: number;
  quality?: number;
}

/**
 * POST /api/convert
 * Convert Markdown to an image.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      markdown,
      theme = "light",
      format = "png",
      width = 800,
      quality = 0.92,
    } = req.body as ConvertRequest;

    // Validate required fields
    if (!markdown || typeof markdown !== "string") {
      res.status(400).json({
        error: "Bad Request",
        message: "The 'markdown' field is required and must be a string.",
      });
      return;
    }

    // Validate theme
    if (theme && !["light", "dark"].includes(theme)) {
      res.status(400).json({
        error: "Bad Request",
        message: "The 'theme' field must be 'light' or 'dark'.",
      });
      return;
    }

    // Validate format
    if (format && !["png", "jpeg", "webp"].includes(format)) {
      res.status(400).json({
        error: "Bad Request",
        message: "The 'format' field must be 'png', 'jpeg', or 'webp'.",
      });
      return;
    }

    // Validate width
    if (width !== undefined && (typeof width !== "number" || width < 100 || width > 4096)) {
      res.status(400).json({
        error: "Bad Request",
        message: "The 'width' field must be a number between 100 and 4096.",
      });
      return;
    }

    // Validate quality
    if (quality !== undefined && (typeof quality !== "number" || quality < 0 || quality > 1)) {
      res.status(400).json({
        error: "Bad Request",
        message: "The 'quality' field must be a number between 0 and 1.",
      });
      return;
    }

    // Generate HTML from markdown
    const html = generateHTML({
      markdown,
      theme: theme || "light",
      width: width || 800,
    });

    // Take screenshot
    const result = await takeScreenshot({
      html,
      width: width || 800,
      format: format || "png",
      quality: format !== "png" ? quality : undefined,
    });

    // Send the image
    res.setHeader("Content-Type", result.contentType);
    res.setHeader("Cache-Control", "no-store");
    res.send(result.buffer);
  } catch (error) {
    console.error("Convert error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to convert markdown to image. Please try again.",
    });
  }
});

export default router;