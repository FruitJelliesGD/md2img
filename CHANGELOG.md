# Changelog

All notable changes to the md2img project.

## [1.0.1] - 2026-05-16

### Fixed

- **下载/复制图片不完整**：修复 `html-to-image` 只捕获滚动容器可视区域的问题。现在截图前会临时解除元素高度约束，捕获完整内容后再恢复。（根因：外层 `h-full overflow-auto` 容器裁剪了滚动区域外的内容）
- **后端截图字体渲染**：增加 `document.fonts.ready` 等待和更充裕的渲染时间（100ms → 300ms），确保 KaTeX 等字体加载完成。

### Changed

- **重构导出逻辑**：`useExport.ts` 新增 `unconstrainElement()` 和 `captureImage()` 辅助函数，消除 `downloadImage` 和 `copyToClipboard` 的重复代码。
- **Preview 组件**：新增 `getContentElement()` 方法暴露内层 `.markdown-body` 元素。
- **后端 viewport**：初始高度从 800 调整为 1080。

## [1.0.0] - 2025-12-01

### Added

- Markdown 实时编辑器（CodeMirror 6）+ GitHub 风格预览（marked）
- 纯前端图片导出：PNG、JPEG、WebP，支持 2x 高清分辨率
- 亮色 / 暗色主题切换
- 复制到剪贴板
- REST API（`/api/convert`）+ 健康检查（`/health`）
- MCP Server 支持
- LaTeX 数学公式（KaTeX + marked-katex-extension）
- Emoji 短代码（125+ 映射，marked-emoji）
- 脚注（marked-footnote）
- 上标 / 下标 / 高亮自定义扩展
- 认证中间件（API Key）+ 速率限制中间件
- Docker / Docker Compose 部署支持
