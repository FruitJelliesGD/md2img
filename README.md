# md2img — Markdown to Image Converter

将 Markdown 实时编辑并导出为高质量图片的开源工具。

## ✨ 功能特性

- **实时预览**：左侧编辑器 + 右侧 GitHub 风格预览，所见即所得
- **多格式导出**：支持 PNG、JPEG、WebP 格式
- **主题切换**：亮色 / 暗色主题，编辑器与预览同步切换
- **高清输出**：默认 2x 分辨率，文字清晰锐利
- **复制到剪贴板**：一键复制预览为图片
- **纯前端导出**：浏览器内直接生成图片，无需后端服务
- **REST API**：提供 `/api/convert` 接口，支持程序化调用
- **MCP Server**：AI Agent 可通过 MCP 协议调用 md2img 能力
- **可配置认证与配额**：通过环境变量灵活控制

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + Vite + Tailwind CSS + CodeMirror 6 |
| Markdown 解析 | marked + KaTeX（数学公式） |
| 前端截图 | html-to-image（纯浏览器端） |
| 后端截图 | Playwright (playwright-core + @sparticuz/chromium) |
| 后端 | Node.js + Express |
| MCP Server | @modelcontextprotocol/sdk |

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- pnpm（推荐）或 npm

### 安装依赖

```bash
# 从根目录安装所有依赖（包括前端、后端、MCP Server）
pnpm install
```

### 本地开发

```bash
# 启动前端（端口 5173）— 无需后端即可使用
pnpm dev:frontend

# 启动后端（端口 3000）— 仅 API/MCP 功能需要
pnpm dev:backend

# 同时启动前后端
pnpm dev
```

然后访问 http://localhost:5173

### 构建

```bash
# 构建前端
pnpm --filter frontend build

# 构建后端
pnpm --filter backend build

# 构建 MCP Server
pnpm --filter md2img-mcp-server build
```

## 📡 使用方式

### 1. 浏览器使用（纯前端，无需后端）

直接打开前端页面，编辑 Markdown 后点击「下载图片」或「复制」按钮。所有图片生成都在浏览器端完成，**不需要启动后端服务**。

### 2. REST API（需要后端）

启动后端后，通过 HTTP 请求调用：

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

### 3. MCP Server（AI Agent 调用）

MCP Server 让 AI Agent（如 Cline）可以通过 MCP 协议调用 md2img，将 Markdown 转换为图片。

#### 安装 MCP Server

```bash
# 构建 MCP Server
pnpm --filter md2img-mcp-server build
```

#### 配置 MCP

在 Cline 的 MCP 设置文件中添加（`cline_mcp_settings.json`）：

```json
{
  "mcpServers": {
    "md2img": {
      "command": "node",
      "args": ["path/to/md2img/mcp-server/dist/index.js"],
      "env": {
        "MD2IMG_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

#### Agent 使用示例

配置完成后，AI Agent 可以直接调用 `md2img` 工具：

```
Agent: 将以下 Markdown 转换为图片：
# Hello World
This is **bold** text.

→ 调用 md2img 工具 → 返回 PNG 图片
```

## 📡 API 文档

### POST /api/convert

将 Markdown 转换为图片。

**请求头：**
```
Content-Type: application/json
Authorization: Bearer <API_KEY>  # 仅在 AUTH_ENABLED=true 时需要
```

**请求体：**
```json
{
  "markdown": "# Hello World\n\nThis is **bold** text.",
  "theme": "light",
  "format": "png",
  "width": 800,
  "quality": 0.92
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| markdown | string | ✅ | - | Markdown 内容 |
| theme | string | ❌ | "light" | "light" 或 "dark" |
| format | string | ❌ | "png" | "png"、"jpeg" 或 "webp" |
| width | number | ❌ | 800 | 图片宽度 (100-4096) |
| quality | number | ❌ | 0.92 | 质量 (0-1)，仅 JPEG/WebP |

**响应：** 成功返回 200 与图片二进制数据。

### GET /health

健康检查端点，返回 `{ "status": "ok" }`。

## ⚙️ 环境变量

### 后端

| 变量 | 默认值 | 说明 |
|------|--------|------|
| PORT | 3000 | 后端端口 |
| AUTH_ENABLED | false | 是否启用认证 |
| API_KEY | - | API 密钥 |
| QUOTA_ENABLED | false | 是否启用速率限制 |
| RATE_LIMIT_MAX | 60 | 速率限制：最大请求数 |
| RATE_LIMIT_WINDOW_MS | 60000 | 速率限制：时间窗口 (ms) |
| SERVERLESS | false | Serverless 模式（使用 @sparticuz/chromium） |
| CHROMIUM_PATH | - | 自定义 Chromium 路径 |

### MCP Server

| 变量 | 默认值 | 说明 |
|------|--------|------|
| MD2IMG_API_URL | http://localhost:3000 | 后端 API 地址 |

## 🐳 Docker 部署

```bash
# 同时启动前后端
docker-compose up --build
```

## 📦 部署指南

### 前端（GitHub Pages）

前端为纯静态文件，可直接部署到 GitHub Pages、Netlify、Vercel 等静态托管平台，**无需后端**。

```bash
# 构建
pnpm --filter frontend build

# 产物在 frontend/dist/ 目录
```

### 后端（Vercel / Railway / Docker）

**Vercel：** 配置 `vercel.json`，将 Express 包装为 Serverless Function。

**Railway：** 直接部署 `backend/` 目录，确保安装 Playwright 依赖。

**Docker：**
```bash
cd backend
docker build -t md2img-backend .
docker run -p 3000:3000 md2img-backend
```

## 📁 项目结构

```
md2img/
├── frontend/          # Vue 3 前端（纯静态，无需后端）
├── backend/           # Express 后端（Playwright 截图 API）
├── mcp-server/        # MCP Server（AI Agent 接入）
├── pnpm-workspace.yaml
├── package.json
├── docker-compose.yml
└── README.md
```

## 📄 许可证

MIT License