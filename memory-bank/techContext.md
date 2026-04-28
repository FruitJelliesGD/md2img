# Tech Context: md2img

## 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.5.13 | UI 框架（Composition API） |
| Vite | ^6.0.5 | 构建工具 |
| TypeScript | ^5.7.2 | 类型安全 |
| Tailwind CSS | ^3.4.17 | 样式框架 |
| CodeMirror 6 | ^6.0.1 | Markdown 编辑器 |
| @codemirror/lang-markdown | ^6.3.1 | Markdown 语法支持 |
| @codemirror/language-data | ^6.5.1 | 代码高亮语言数据 |
| @codemirror/commands | ^6.x | 编辑器命令（defaultKeymap, history） |
| marked | ^15.0.7 | Markdown 解析 |
| marked-katex-extension | ^5.1.8 | LaTeX 数学公式支持（marked 扩展） |
| katex | ^0.16.45 | 数学公式渲染引擎 |
| marked-emoji | ^2.0.3 | Emoji 短代码支持（marked 扩展） |
| marked-footnote | ^1.4.0 | 脚注支持（marked 扩展） |
| html-to-image | ^1.11.11 | 前端截图（剪贴板复制） |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | >=18 | 运行时 |
| Express | ^4.21.2 | Web 框架 |
| TypeScript | ^5.7.2 | 类型安全 |
| playwright-core | ^1.49.1 | 浏览器自动化 |
| @sparticuz/chromium | ^131.0.0 | Serverless Chromium |
| marked | ^15.0.7 | Markdown 解析（后端 HTML 生成） |
| marked-katex-extension | ^5.1.8 | LaTeX 数学公式支持（marked 扩展） |
| katex | ^0.16.45 | 数学公式渲染引擎 |
| marked-emoji | ^2.0.3 | Emoji 短代码支持（marked 扩展） |
| marked-footnote | ^1.4.0 | 脚注支持（marked 扩展） |
| express-rate-limit | ^7.5.0 | 速率限制 |
| cors | ^2.8.5 | 跨域支持 |
| dotenv | ^16.4.7 | 环境变量 |
| tsx | ^4.19.2 | 开发时 TypeScript 运行 |

### 根目录依赖
| 技术 | 版本 | 用途 |
|------|------|------|
| playwright | ^1.59.1 | Playwright 浏览器安装 |
| github-markdown-css | ^5.9.0 | GitHub 风格 Markdown CSS |
| katex | ^0.16.45 | 数学公式渲染引擎 |
| marked-emoji | ^2.0.3 | Emoji 短代码支持 |
| marked-footnote | ^1.4.0 | 脚注支持 |
| marked-katex-extension | ^5.1.8 | LaTeX 数学公式支持 |

### 开发工具
| 工具 | 用途 |
|------|------|
| pnpm workspaces | 单仓库管理 |
| concurrently | 并行启动前后端 |
| vue-tsc | Vue TypeScript 检查 |
| autoprefixer | CSS 前缀 |

## 开发环境
- 操作系统：Windows 11
- IDE：Visual Studio Code
- Node.js：v25.2.0
- npm：11.6.2

## 技术约束
- 前端构建产物为纯静态文件（无 SSR）
- 后端依赖 Playwright Chromium（需要系统级依赖）
- Serverless 环境使用 @sparticuz/chromium 替代完整 Playwright
- 前端 API 地址通过 `VITE_API_URL` 环境变量配置
- KaTeX CSS 通过 CDN 引入（前端 `index.html` + 后端 `htmlTemplate.ts`）
- 后端 `marked-katex-extension` 无官方类型声明，需自定义 `.d.ts` 文件
- 后端 `marked-emoji` 无官方类型声明，需自定义 `.d.ts` 文件
- 前端 Vite `base: "/md2img/"`（GitHub Pages 子路径部署）

## 新增文件
- `backend/src/types/marked-katex-extension.d.ts` — marked-katex-extension 的 TypeScript 类型声明
- `backend/src/types/marked-emoji.d.ts` — marked-emoji 的 TypeScript 类型声明
- `frontend/src/utils/emojiDefinitions.ts` — Emoji 短代码映射（125 个）
- `frontend/src/utils/markdownExtensions.ts` — 自定义 marked 扩展（上标、下标、高亮）
- `backend/src/utils/emojiDefinitions.ts` — 后端 Emoji 短代码映射（125 个）
- `backend/src/utils/markdownExtensions.ts` — 后端自定义 marked 扩展
- `.vscode/settings.json` — VS Code 工作区设置（抑制 `@tailwind` CSS 警告）

## 已知问题
- 前端构建有一个 980KB 的大 chunk（CodeMirror 语言包），可通过代码分割优化
- CodeMirror 主题切换采用销毁重建方式（非热重配置）