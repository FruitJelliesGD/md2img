# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Security

- Use `crypto.timingSafeEqual()` for API key comparison to prevent timing attacks (`backend/src/middleware/auth.ts`)
- Add markdown length limit (100,000 chars) to prevent DoS (`backend/src/routes/convert.ts`)
- Add HTML sanitization with DOMPurify on both backend and frontend to prevent XSS (`backend/src/utils/htmlTemplate.ts`, `frontend/src/composables/useMarkdown.ts`)
- Fix NaN bypass on width/quality validation with `Number.isFinite()` (`backend/src/routes/convert.ts`)
- Guard `parseInt` NaN in rate limiter with fallback values (`backend/src/middleware/rateLimit.ts`)

### Backend

- Add graceful shutdown with SIGTERM/SIGINT handlers and browser cleanup (`backend/src/index.ts`)
- Fix browser instance race condition with promise-based lock (`backend/src/services/screenshot.ts`)
- Add 30s timeout on screenshot operations (`backend/src/services/screenshot.ts`)
- Replace hardcoded `waitForTimeout(100)` with `document.fonts.ready` (`backend/src/services/screenshot.ts`)
- Add highlight.js code syntax highlighting to backend screenshots (`backend/src/utils/htmlTemplate.ts`)
- Bundle highlight.js CSS locally for offline support (`packages/shared/src/hljs-css.ts`)

### Frontend - Features

- Synchronized scrolling between editor and preview (`frontend/src/composables/useSyncScroll.ts`)
- Use CodeMirror `Compartment` for theme switching instead of destroy/recreate (`frontend/src/components/Editor.vue`)
- Add CodeMirror search extension (Ctrl+F) (`frontend/src/components/Editor.vue`)
- Add keyboard shortcut help modal (Ctrl+/) (`frontend/src/components/ShortcutHelp.vue`)
- Add localStorage persistence for markdown content, export settings, and editor width (`frontend/src/App.vue`)
- Add keyboard shortcuts: Ctrl+S (download), Ctrl+Shift+C (copy) (`frontend/src/App.vue`)
- Make markdown debounce delay configurable (`frontend/src/composables/useMarkdown.ts`)

### Frontend - UI/UX

- Comprehensive UI beautification: custom Tailwind theme (primary palette, shadows, fonts)
- Create BaseButton component (primary/secondary/ghost variants)
- Replace all emoji icons with SVG Lucide icons
- Add branded logo icon to toolbar
- Differentiate visual hierarchy: toolbar shadow, status bar background, mobile tab separation
- Load Inter + JetBrains Mono fonts via Google Fonts
- Resizer visible by default (subtle gray line)
- Modal transitions with scale + backdrop blur
- Export settings with visible labels and custom range slider
- Unified kbd styling
- Status bar with app name and warning escalation (80k yellow, 100k red)
- Preview content max-w-4xl constraint
- Toast notifications with icons (success/error/info)
- Theme switching transition animation
- Scrollbar theme-aware styling

### Frontend - i18n

- Full internationalization: all UI strings use `t()` function
- Add zh-CN and en locale files with 50+ translation keys
- Mobile tab bar shows correct translated text
- API documentation modal fully translated
- Shortcut help descriptions translated

### Frontend - Accessibility

- Add focus trap to all modals (ApiDocModal, ShortcutHelp)
- Add ESC key to close modals
- Add focus restoration on modal close
- Add ARIA roles: tablist/tab for mobile tabs, status for toast, dialog for modals
- Add aria-label to all interactive elements
- Shortcuts don't fire through open modals

### Frontend - Mobile

- Add responsive layout with `useMediaQuery` composable
- Tab-based editor/preview switching at 768px breakpoint
- Resizer hidden on mobile, full-width panels

### Frontend - Code Quality

- Fix CJK word count to include Japanese/Korean characters
- Merge duplicate watches in Preview.vue
- Fix useMediaQuery initial state from actual viewport
- Simplify persist() function with single pendingWrite
- Add beforeunload handler to flush pending localStorage writes
- Fix clipboard copy to always capture as PNG (correct MIME type)
- Fix mobile tabs showing literal "export.editor" text

### Code Quality

- Create `@md2img/shared` workspace package for shared utilities (`packages/shared/`)
- Deduplicate `markdownExtensions.ts` and `emojiDefinitions.ts` into shared package
- Deduplicate marked configuration into `configureMarked()` function
- Replace ~240 lines of duplicated light/dark CSS with CSS custom properties (`backend/src/utils/htmlTemplate.ts`)
- Deduplicate frontend theme CSS with CSS variables (`frontend/src/style.css`)
- Extract shared options helper in `useExport.ts` to eliminate PNG/JPEG/WebP branch duplication
- Remove duplicate dependencies from root `package.json`

### Infrastructure

- Add ESLint + Prettier configuration (`eslint.config.js`, `.prettierrc`)
- Add Vitest test framework with test suite (`vitest.config.ts`)
- Add tests: auth, input validation, markdown extensions, useMarkdown, useExport
- Add frontend Dockerfile with nginx:alpine multi-stage build (`frontend/Dockerfile`)
- Fix `docker-compose.yml` frontend port mapping (5173:80)
- Add GitHub Actions CI workflow for all packages (`.github/workflows/ci.yml`)
