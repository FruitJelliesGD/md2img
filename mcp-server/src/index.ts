#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";

const API_URL = process.env.MD2IMG_API_URL || "http://localhost:3000";

interface ConvertRequest {
  markdown: string;
  theme?: "light" | "dark";
  format?: "png" | "jpeg" | "webp";
  width?: number;
  quality?: number;
}

interface ConvertResponse {
  buffer: Buffer;
  contentType: string;
}

const isValidConvertArgs = (
  args: any
): args is ConvertRequest =>
  typeof args === "object" &&
  args !== null &&
  typeof args.markdown === "string" &&
  (args.theme === undefined || ["light", "dark"].includes(args.theme)) &&
  (args.format === undefined || ["png", "jpeg", "webp"].includes(args.format)) &&
  (args.width === undefined || (typeof args.width === "number" && args.width >= 100 && args.width <= 4096)) &&
  (args.quality === undefined || (typeof args.quality === "number" && args.quality >= 0 && args.quality <= 1));

/**
 * Call the md2img backend API to convert markdown to image.
 */
async function convertMarkdown(options: ConvertRequest): Promise<ConvertResponse> {
  const {
    markdown,
    theme = "light",
    format = "png",
    width = 800,
    quality = 0.92,
  } = options;

  const response = await fetch(`${API_URL}/api/convert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown, theme, format, width, quality }),
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errData = await response.json() as any;
      errorMessage = errData?.message || errorMessage;
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get("content-type") || `image/${format}`;

  return { buffer, contentType };
}

class Md2ImgServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "md2img",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "md2img",
          description:
            "Convert Markdown text to an image (PNG, JPEG, or WebP). " +
            "Supports GitHub-style rendering, code syntax highlighting, tables, " +
            "LaTeX math formulas ($...$ and $$...$$), and both light/dark themes. " +
            "Returns the image as base64-encoded data.",
          inputSchema: {
            type: "object",
            properties: {
              markdown: {
                type: "string",
                description: "The Markdown content to convert to an image",
              },
              theme: {
                type: "string",
                enum: ["light", "dark"],
                description: "Color theme (default: light)",
              },
              format: {
                type: "string",
                enum: ["png", "jpeg", "webp"],
                description: "Output image format (default: png)",
              },
              width: {
                type: "number",
                description: "Image width in pixels, range 100-4096 (default: 800)",
                minimum: 100,
                maximum: 4096,
              },
              quality: {
                type: "number",
                description: "Image quality for JPEG/WebP, range 0-1 (default: 0.92). Only applies to JPEG and WebP formats.",
                minimum: 0,
                maximum: 1,
              },
            },
            required: ["markdown"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== "md2img") {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      if (!isValidConvertArgs(request.params.arguments)) {
        throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
      }

      try {
        const { buffer, contentType } = await convertMarkdown(
          request.params.arguments
        );
        const base64 = buffer.toString("base64");

        return {
          content: [
            {
              type: "image",
              data: base64,
              mimeType: contentType,
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Failed to convert markdown to image: ${message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("md2img MCP server running on stdio");
  }
}

const server = new Md2ImgServer();
server.run().catch(console.error);