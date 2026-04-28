import { chromium, type Browser, type Page } from "playwright-core";

let browserInstance: Browser | null = null;

/**
 * Get or create a shared Chromium browser instance.
 * Supports both local development (full playwright) and serverless (@sparticuz/chromium).
 */
async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  const isServerless = process.env.SERVERLESS === "true";

  if (isServerless) {
    // Serverless environment: use @sparticuz/chromium
    const chromiumModule = await import("@sparticuz/chromium");
    const chromiumPkg = chromiumModule.default || chromiumModule;
    browserInstance = await chromium.launch({
      args: chromiumPkg.args,
      executablePath: await chromiumPkg.executablePath(),
      headless: true,
    });
  } else {
    // Local development: use system-installed or bundled Chromium
    const executablePath = process.env.CHROMIUM_PATH || undefined;
    browserInstance = await chromium.launch({
      headless: true,
      executablePath,
    });
  }

  return browserInstance;
}

export interface ScreenshotOptions {
  html: string;
  width: number;
  format: "png" | "jpeg" | "webp";
  quality?: number;
}

export interface ScreenshotResult {
  buffer: Buffer;
  contentType: string;
}

/**
 * Render HTML to an image using Playwright.
 */
export async function takeScreenshot(options: ScreenshotOptions): Promise<ScreenshotResult> {
  const { html, width, format, quality } = options;
  const deviceScaleFactor = 2;

  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: { width, height: 800 },
    deviceScaleFactor,
  });

  let page: Page | null = null;

  try {
    page = await context.newPage();

    // Set the HTML content
    await page.setContent(html, { waitUntil: "networkidle" });

    // Wait for fonts and layout to settle
    await page.waitForTimeout(100);

    // Get the full page height by measuring the body
    const bodyHandle = await page.$("body");
    const boundingBox = await bodyHandle?.boundingBox();

    const clipWidth = width;
    const clipHeight = boundingBox ? Math.ceil(boundingBox.height) : 800;

    // Take a full-page screenshot with clip
    const screenshotOptions: Record<string, unknown> = {
      clip: {
        x: 0,
        y: 0,
        width: clipWidth,
        height: clipHeight,
      },
      type: format,
    };

    if ((format === "jpeg" || format === "webp") && quality !== undefined) {
      screenshotOptions.quality = Math.round(quality * 100);
    }

    const buffer = await page.screenshot(screenshotOptions) as Buffer;

    const contentTypes: Record<string, string> = {
      png: "image/png",
      jpeg: "image/jpeg",
      webp: "image/webp",
    };

    return {
      buffer,
      contentType: contentTypes[format] || "image/png",
    };
  } finally {
    if (page) {
      await page.close();
    }
    await context.close();
  }
}

/**
 * Close the browser instance (for cleanup).
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}