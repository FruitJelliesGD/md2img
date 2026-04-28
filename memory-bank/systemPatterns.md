# System Patterns: md2img

## 系统架构

```
┌─────────────────────────────────────────┐
│              Frontend (Vue 3)            │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │ Editor   │  │ Preview              │ │
│  │(CodeMir) │  │(marked + GitHub CSS) │ │
│  └──────────┘  └──────────────────────┘ │
│  ┌──────────────────────────────────────┐│
│  │ Toolbar + ExportSettings + StatusBar ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │ useExport → API call / html-to-image ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │ utils/                               ││
│  │  emojiDefinitions.ts (125 映射)      ││
│  │  markdownExtensions.ts (上标/下标/高亮)││
│  └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
                    │
                    │ HTTP POST /api/convert
                    ▼
┌─────────────────────────────────────────┐
│              Backend (Express)           │
│  ┌──────────────────────────────────────┐│
│  │ Auth Middleware → Rate Limit         ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │ Convert Route → HTML Template Gen    ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │ Screenshot Service (Playwright)      ││
│  │ → Chromium → Render HTML → Screenshot││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │ utils/                               ││
│  │  htmlTemplate.ts (GitHub 风格 HTML)  ││
│  │  emojiDefinitions.ts (125 映射)      ││
│  │  markdownExtensions.ts (上标/下标/高亮)││
│  └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

## 关键设计模式

### 1. Composable 模式（前端）
- `useTheme`：全局主题状态（单例 ref + localStorage 持久化）
- `useMarkdown`：Markdown 解析（带 200ms 防抖的 watch）
- `useExport`：导出逻辑（API 下载 + 前端剪贴板复制）

### 2. 中间件链模式（后端）
```
Request → CORS → Body Parser → Rate Limit → Auth → Route Handler
```

### 3. 模板引擎模式
- `htmlTemplate.ts`：根据 markdown + theme + width 生成完整 HTML 页面
- 内联 CSS（GitHub 风格）+ KaTeX CSS（CDN 引入）
- marked 配置链：`marked-katex-extension` + `marked-emoji` + `marked-footnote` + 自定义扩展

### 4. 浏览器实例复用模式
- Playwright 浏览器实例全局复用（`browserInstance`）
- 支持本地和 Serverless 两种启动方式

### 5. 组件通信模式
- 父子组件：Props + Emits（单向数据流）
- 跨组件：`previewRef` 通过 `defineExpose` 暴露 DOM 元素
- 全局状态：composable 单例（theme）

### 6. Markdown 扩展注册模式（前后端共享）
- 前端 `useMarkdown.ts` 和后端 `htmlTemplate.ts` 使用相同的扩展注册链
- `markdownExtensions.ts`：自定义 marked 扩展（上标、下标、高亮）
- `emojiDefinitions.ts`：125 个 Emoji 短代码映射
- 扩展注册顺序：KaTeX → Emoji → Footnote → 自定义扩展

## 组件关系
```
App.vue
├── Toolbar.vue
│   └── ExportSettings.vue
├── Editor.vue (CodeMirror 6)
├── Preview.vue (marked + GitHub CSS)
├── StatusBar.vue
├── ApiDocModal.vue
└── Toast.vue
```

## 数据流
```
用户输入 → markdown ref → useMarkdown（marked + KaTeX + Emoji + Footnote + 自定义扩展）→ renderedHtml → Preview
                ↓
         useExport → POST /api/convert → 下载图片
                ↓
         html-to-image → 剪贴板复制