# Active Context: md2img

## 当前工作焦点
README 和记忆库文档已更新，补充了 Emoji 短代码、脚注、上标/下标、高亮等 Markdown 扩展功能的记录。

## 最近完成的变更
- 创建完整的前后端项目结构
- 实现前端：Vue 3 + CodeMirror 6 编辑器 + marked 预览 + 导出功能
- 实现后端：Express + Playwright 截图引擎 + 认证/配额中间件
- 修复 CodeMirror 导入问题（`@codemirror/commands` 替代 `codemirror`）
- 修复主题切换时的 `reconfigure` 问题（改为销毁重建编辑器）
- 前端构建验证通过（vue-tsc + vite build）
- **添加 LaTeX 数学公式支持**：使用 KaTeX + marked-katex-extension，前后端同时支持 `$...$` 行内公式和 `$$...$$` 块级公式
- 创建 `backend/src/types/marked-katex-extension.d.ts` 类型声明文件
- KaTeX CSS 通过 CDN 引入（前端 `index.html` + 后端 `htmlTemplate.ts`）
- **添加 Emoji 短代码支持**：使用 `marked-emoji` + `emojiDefinitions.ts`（125 个映射），前后端同时支持
- **添加脚注支持**：使用 `marked-footnote`，前后端同时支持 `[^1]` 语法
- **添加自定义 Markdown 扩展**：上标（`X^2^`）、下标（`H~2~O`）、高亮（`==text==`），前后端同时支持
- 创建 `backend/src/types/marked-emoji.d.ts` 类型声明文件
- **修复 VS Code CSS 警告**：创建 `.vscode/settings.json`，设置 `css.lint.unknownAtRules: "ignore"` 抑制 `@tailwind` 未知规则警告
- **更新 README.md**：补充 Markdown 扩展语法表格、技术栈更新、项目结构细化
- **更新记忆库文档**：同步所有文件以反映最新项目状态

## 下一步
- 端到端测试（前后端联调）
- 可选优化：代码分割（当前有 980KB 的大 chunk）
- 可选：添加 GitHub Actions CI/CD 配置

## 重要决策
- CodeMirror 主题切换采用销毁重建方式（因 `EditorState.reconfigure` 不可用）
- 剪贴板复制使用前端 `html-to-image` 库（纯前端，避免网络延迟）
- 下载功能使用后端 Playwright API（保证样式一致性）
- Chromium 支持本地和 Serverless 两种模式（通过 `SERVERLESS` 环境变量切换）
- 数学公式使用 KaTeX（比 MathJax 更快）+ marked-katex-extension（marked 官方扩展）
- KaTeX CSS 通过 CDN 引入而非打包（减少构建体积，Playwright 可加载 CDN 资源）
- Emoji 使用 marked-emoji 包 + 自定义 125 个短代码映射
- 脚注使用 marked-footnote 包
- 上标/下标/高亮使用自定义 marked 扩展（非第三方包）

## 活跃的考虑
- 无阻塞性问题