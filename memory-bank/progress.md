# Progress: md2img

## 当前状态
项目初始构建完成，前端构建验证通过，LaTeX 数学公式、Emoji 短代码、脚注、上标/下标/高亮等 Markdown 扩展功能均已实现，README 和记忆库文档已同步更新。

## ✅ 已完成

### 阶段一：项目基础搭建
- [x] 根目录 `package.json`（pnpm workspaces）
- [x] `pnpm-workspace.yaml`
- [x] `.env.example`（环境变量说明）
- [x] `LICENSE`（MIT）
- [x] `.gitignore`
- [x] `docker-compose.yml`

### 阶段二：后端开发
- [x] `backend/package.json` + `tsconfig.json`
- [x] HTML 模板生成器（`htmlTemplate.ts`）— 亮/暗主题 GitHub 风格 CSS
- [x] Playwright 截图服务（`screenshot.ts`）— 2x DPI、多格式、浏览器复用
- [x] 认证中间件（`auth.ts`）— Bearer Token，环境变量控制
- [x] 速率限制中间件（`rateLimit.ts`）— express-rate-limit
- [x] 路由：`POST /api/convert` + `GET /health`
- [x] Express 入口（`index.ts`）
- [x] `Dockerfile`

### 阶段三：前端开发
- [x] `frontend/package.json` + `vite.config.ts` + `tsconfig.json`
- [x] Tailwind CSS 配置
- [x] Composables：`useTheme`、`useMarkdown`、`useExport`
- [x] 组件：Editor、Preview、Toolbar、ExportSettings、StatusBar、ApiDocModal、Toast
- [x] 主布局 `App.vue`（可拖拽分栏）
- [x] 全局样式（GitHub Markdown CSS 亮/暗主题）

### 阶段四：文档
- [x] `README.md`（完整文档：功能、API、环境变量、部署指南）

### 依赖安装与构建
- [x] 后端依赖安装
- [x] 前端依赖安装
- [x] 前端构建验证通过（vue-tsc + vite build）

### 阶段五：LaTeX 数学公式支持
- [x] 安装 `katex` + `marked-katex-extension` 依赖（workspace root）
- [x] 前端 `useMarkdown.ts` 注册 marked-katex-extension
- [x] 前端 `index.html` 引入 KaTeX CSS CDN
- [x] 后端 `htmlTemplate.ts` 注册 marked-katex-extension + 引入 KaTeX CSS CDN
- [x] 创建 `backend/src/types/marked-katex-extension.d.ts` 类型声明
- [x] 前端构建验证通过（vue-tsc + vite build）
- [x] 后端加载验证通过（tsx watch 正常启动）

### 阶段六：Markdown 扩展功能
- [x] 安装 `marked-emoji` + `marked-footnote` 依赖
- [x] 创建 `emojiDefinitions.ts`（125 个 Emoji 短代码映射）— 前后端各一份
- [x] 创建 `markdownExtensions.ts`（自定义上标、下标、高亮扩展）— 前后端各一份
- [x] 前端 `useMarkdown.ts` 注册 Emoji + Footnote + 自定义扩展
- [x] 后端 `htmlTemplate.ts` 注册 Emoji + Footnote + 自定义扩展
- [x] 创建 `backend/src/types/marked-emoji.d.ts` 类型声明

### 阶段七：开发环境优化
- [x] 创建 `.vscode/settings.json`，设置 `css.lint.unknownAtRules: "ignore"` 抑制 `@tailwind` 未知规则警告

### 阶段八：文档同步更新
- [x] 更新 README.md：补充 Markdown 扩展语法表格、技术栈更新、项目结构细化
- [x] 更新记忆库所有文件（projectbrief、productContext、activeContext、systemPatterns、techContext、progress）

## ⏳ 待完成

### 高优先级
- [ ] 后端 TypeScript 构建验证
- [ ] 端到端测试（前后端联调）
- [ ] 安装 Playwright 浏览器（`npx playwright install chromium`）

### 中优先级
- [ ] 前端代码分割优化（减少大 chunk）
- [ ] GitHub Actions CI/CD 配置
- [ ] Vercel 部署配置（`vercel.json`）

### 低优先级
- [ ] 代码块语法高亮（当前无高亮）
- [ ] 单元测试

## 已知问题
- 前端构建有一个 980KB 大 chunk（CodeMirror 语言包），可通过 `manualChunks` 优化
- CodeMirror 主题切换采用销毁重建方式
- 后端尚未验证 Playwright 运行（TypeScript 加载已验证通过）