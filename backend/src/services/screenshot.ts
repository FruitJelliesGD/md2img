import { chromium, type Browser, type Page } from "playwright-core";

let browserInstance: Browser | null = null;
let browserPromise: Promise<Browser> | null = null;

async function launchBrowser(): Promise<Browser> {
  const isServerless = process.env.SERVERLESS === "true";

  if (isServerless) {
    const chromiumModule = await import("@sparticuz/chromium");
    const chromiumPkg = chromiumModule.default || chromiumModule;
    return chromium.launch({
      args: chromiumPkg.args,
      executablePath: await chromiumPkg.executablePath(),
      headless: true,
    });
  }

  const executablePath = process.env.CHROMIUM_PATH || undefined;
  return chromium.launch({
    headless: true,
    executablePath,
  });
}

async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }
  if (!browserPromise) {
    browserPromise = launchBrowser()
      .then((b) => {
        browserInstance = b;
        return b;
      })
      .finally(() => {
        browserPromise = null;
      });
  }
  return browserPromise;
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

export async function takeScreenshot(options: ScreenshotOptions): Promise<ScreenshotResult> {
  const { html, width, format, quality } = options;
  const deviceScaleFactor = 2;

  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: { width, height: 1080 },
    deviceScaleFactor,
  });

  let page: Page | null = null;

  try {
    page = await context.newPage();

    await page.setContent(html, { waitUntil: "networkidle" });

    await page.evaluate(() => document.fonts.ready);

    const bodyHandle = await page.$("body");
    const boundingBox = await bodyHandle?.boundingBox();

    const clipHeight = boundingBox ? Math.ceil(boundingBox.height) : 1080;

    const screenshotOptions: Record<string, unknown> = {
      clip: {
        x: 0,
        y: 0,
        width,
        height: clipHeight,
      },
      type: format,
    };

    if ((format === "jpeg" || format === "webp") && quality !== undefined) {
      screenshotOptions.quality = Math.round(quality * 100);
    }

    const buffer = await Promise.race([
      page.screenshot(screenshotOptions) as Promise<Buffer>,
      new Promise<Buffer>((_, reject) =>
        setTimeout(() => reject(new Error("Screenshot timed out after 30s")), 30_000)
      ),
    ]);

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

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
