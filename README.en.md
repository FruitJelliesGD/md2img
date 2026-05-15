# md2img — Markdown to Image Converter

> 🌐 [English](README.en.md) | [中文](README.md)

An open-source tool to edit Markdown in real-time and export it as high-quality images.

## ✨ Features

- **Live Preview** — Left-side editor + right-side GitHub-styled preview, what you see is what you get
- **Multi-format Export** — PNG, JPEG, WebP supported
- **Theme Toggle** — Light / Dark themes, synced across editor and preview
- **High Resolution** — 2× pixel ratio by default for crisp text
- **Copy to Clipboard** — One-click copy of the preview as an image
- **Pure Frontend Export** — Images are generated in the browser, no backend required
- **REST API** — `/api/convert` endpoint for programmatic usage
- **MCP Server** — AI agents can invoke md2img via the MCP protocol
- **Configurable Auth & Rate Limiting** — Flexible controls via environment variables

### 📝 Extended Markdown Syntax

| Syntax | Description | Example |
|--------|-------------|---------|
| `$...$` / `$$...$$` | LaTeX math formulas | `$E=mc^2$` → E=mc² |
| `:emoji_name:` | Emoji shortcodes (125+) | `:rocket:` → 🚀 |
| `[^1]` / `[^1]:` | Footnotes | `Text[^1]` + `[^1]: Note` |
| `X^2^` | Superscript | `X^2^` → X² |
| `H~2~O` | Subscript | `H~2~O` → H₂O |
| `==text==` | Highlight | `==highlight==` → highlight |

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3 + Vite + Tailwind CSS + CodeMirror 6 |
| Markdown Parsing | marked + KaTeX (math) + marked-emoji + marked-footnote + custom extensions (sup/sub/highlight) |
| Frontend Screenshot | html-to-image (browser-side) |
| Backend Screenshot | Playwright (playwright-core + @sparticuz/chromium) |
| Backend | Node.js + Express |
| MCP Server | @modelcontextprotocol/sdk |

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm

### Install Dependencies

```bash
# Install all dependencies from the root (frontend, backend, MCP Server)
pnpm install
```

### Local Development

```bash
# Start frontend only (port 5173) — no backend needed for basic usage
pnpm dev:frontend

# Start backend only (port 3000) — only required for API/MCP features
pnpm dev:backend

# Start both frontend and backend
pnpm dev
```

Then visit http://localhost:5173

### Build

```bash
# Build frontend
pnpm --filter frontend build

# Build backend
pnpm --filter backend build
```

## 📡 Usage

### 1. Browser (Pure Frontend, No Backend Required)

Open the frontend page, edit your Markdown, then click the **Download Image** or **Copy** button. All image generation happens in the browser — **no backend service needed**.

### 2. REST API (Backend Required)

After starting the backend, make HTTP requests:

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello", "format": "png"}' \
  --output output.png
```

```javascript
// JavaScript
const response = await fetch('http://localhost:3000/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ markdown: '# Hello', format: 'png' }),
});
const blob = await response.blob();
```

```python
# Python
import requests
response = requests.post(
    'http://localhost:3000/api/convert',
    json={'markdown': '# Hello', 'format': 'png'}
)
with open('output.png', 'wb') as f:
    f.write(response.content)
```

## 📡 API Documentation

### POST /api/convert

Convert Markdown to an image.

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <API_KEY>  # Only required when AUTH_ENABLED=true
```

**Request Body:**
```json
{
  "markdown": "# Hello World\n\nThis is **bold** text.",
  "theme": "light",
  "format": "png",
  "width": 800,
  "quality": 0.92
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| markdown | string | ✅ | - | Markdown content |
| theme | string | ❌ | "light" | "light" or "dark" |
| format | string | ❌ | "png" | "png", "jpeg" or "webp" |
| width | number | ❌ | 800 | Image width (100–4096) |
| quality | number | ❌ | 0.92 | Quality (0–1), JPEG/WebP only |

**Response:** Returns `200` with the image binary data on success.

### GET /health

Health check endpoint, returns `{ "status": "ok" }`.

## ⚙️ Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Backend port |
| AUTH_ENABLED | false | Enable API key authentication |
| API_KEY | - | API key value |
| QUOTA_ENABLED | false | Enable rate limiting |
| RATE_LIMIT_MAX | 60 | Max requests per window |
| RATE_LIMIT_WINDOW_MS | 60000 | Rate limit time window (ms) |
| SERVERLESS | false | Serverless mode (uses @sparticuz/chromium) |
| CHROMIUM_PATH | - | Custom Chromium path |

## 🐳 Docker Deployment

```bash
# Start both frontend and backend
docker-compose up --build
```

## 📦 Deployment Guide

### Frontend (GitHub Pages / Static Hosting)

The frontend is pure static files and can be deployed directly to GitHub Pages, Netlify, Vercel, or any static hosting platform — **no backend required**.

```bash
# Build
pnpm --filter frontend build

# Output is in frontend/dist/
```

### Backend (Vercel / Railway / Docker)

**Vercel:** Configure `vercel.json` and wrap Express as a Serverless Function.

**Railway:** Deploy the `backend/` directory directly, ensuring Playwright dependencies are installed.

**Docker:**
```bash
cd backend
docker build -t md2img-backend .
docker run -p 3000:3000 md2img-backend
```

## 📁 Project Structure

```
md2img/
├── frontend/              # Vue 3 frontend (static, no backend needed)
│   └── src/
│       ├── components/    # UI components (Editor, Preview, Toolbar, etc.)
│       └── composables/   # Composables (useTheme, useMarkdown, useExport)
├── backend/               # Express backend (Playwright screenshot API)
│   └── src/
│       ├── routes/        # API routes (/api/convert, /health)
│       ├── middleware/     # Auth, rate limiting
│       ├── services/      # Playwright screenshot service
│       ├── utils/         # HTML template generation
│       └── types/         # TypeScript type declarations
├── packages/shared/       # Shared utilities (emoji mappings, Markdown extensions)
├── memory-bank/           # Project memory bank
├── pnpm-workspace.yaml
├── docker-compose.yml
├── package.json
└── README.md              # Chinese documentation (primary)
└── README.en.md           # English documentation (secondary)
```

## 📄 License

MIT License
