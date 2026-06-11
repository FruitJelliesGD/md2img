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
- Add highlight.js CSS via CDN in HTML template (`backend/src/utils/htmlTemplate.ts`)

### Frontend

- Use CodeMirror `Compartment` for theme switching instead of destroy/recreate (`frontend/src/components/Editor.vue`)
- Add localStorage persistence for markdown content and export settings (`frontend/src/App.vue`)
- Add keyboard shortcuts: Ctrl+S (download), Ctrl+Shift+C (copy) (`frontend/src/App.vue`)
- Make markdown debounce delay configurable (`frontend/src/composables/useMarkdown.ts`)

### Code Quality

- Create `@md2img/shared` workspace package for shared utilities (`packages/shared/`)
- Deduplicate `markdownExtensions.ts` (77 lines) and `emojiDefinitions.ts` (125 lines) into shared package
- Deduplicate marked configuration into `configureMarked()` function
- Replace ~240 lines of duplicated light/dark CSS with CSS custom properties (`backend/src/utils/htmlTemplate.ts`)
- Deduplicate frontend theme CSS with CSS variables (`frontend/src/style.css`)
- Extract shared options helper in `useExport.ts` to eliminate PNG/JPEG/WebP branch duplication
- Remove duplicate dependencies from root `package.json`

### Infrastructure

- Add ESLint + Prettier configuration (`eslint.config.js`, `.prettierrc`)
- Add Vitest test framework with initial test suite (`vitest.config.ts`)
- Add tests: auth timing-safe comparison, input validation, markdown extensions
- Add frontend Dockerfile with nginx:alpine multi-stage build (`frontend/Dockerfile`)
- Fix `docker-compose.yml` frontend port mapping (5173:80)
- Add GitHub Actions CI workflow for all packages (`.github/workflows/ci.yml`)
