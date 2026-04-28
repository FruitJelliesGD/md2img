# Project Brief: md2img

## 项目名称
md2img — Markdown to Image Converter

## 项目概述
构建一个前端 + 后端完整的开源项目，允许人类用户通过网页编辑器实时预览 Markdown 并导出为图片，同时提供 REST API 供程序化调用，MCP Server 供 AI Agent 调用。

## 核心需求
1. **前端应用**：Vue 3 + CodeMirror 6 编辑器 + 实时 GitHub 风格预览 + 多格式导出
2. **后端 API**：Node.js + Express + Playwright 截图引擎
3. **认证与配额**：可配置的环境变量控制
4. **MCP Server**：AI Agent 通过 MCP 协议调用 md2img 能力
5. **部署**：前端 GitHub Pages，后端 Vercel/Railway/Docker

## Markdown 扩展功能
- LaTeX 数学公式（KaTeX + marked-katex-extension）
- Emoji 短代码（marked-emoji，125+ 映射）
- 脚注（marked-footnote）
- 上标（自定义扩展：`X^2^` → X²）
- 下标（自定义扩展：`H~2~O` → H₂O）
- 高亮（自定义扩展：`==text==` → <mark>text</mark>）

## 项目范围
- 前端：编辑器、预览、导出（下载 + 剪贴板）、主题切换、API 文档
- 后端：POST /api/convert（截图）、GET /health、认证、速率限制
- MCP Server：md2img 工具（Markdown → 图片）
- 基础设施：Docker、docker-compose、环境变量配置

## 许可证
MIT

## 创建时间
2026-04-28