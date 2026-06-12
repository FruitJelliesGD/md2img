import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import { configureMarked, ALL_CSS } from "@md2img/shared";

const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

configureMarked();

const renderer = {
  code({ text, lang }: { text: string; lang?: string; escaped?: boolean }) {
    const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
    const highlighted = hljs.highlight(text, { language }).value;
    const langClass = `language-${language}`;
    return `<pre><code class="${langClass}">${highlighted}</code></pre>`;
  },
};

marked.use({ renderer });

export interface TemplateOptions {
  markdown: string;
  theme: "light" | "dark";
  width: number;
}

export function generateHTML(options: TemplateOptions): string {
  const { markdown, theme, width } = options;
  const htmlContent = purify.sanitize(marked.parse(markdown) as string);

  const hljsTheme = theme === "dark"
    ? "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css"
    : "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css";

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.45/dist/katex.min.css"
    crossorigin="anonymous"
  />
  <link rel="stylesheet" href="${hljsTheme}" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html { margin: 0; padding: 0; }
    ${ALL_CSS}
  </style>
</head>
<body>
  <div class="markdown-body" style="max-width: ${width}px; margin: 0 auto;">
    ${htmlContent}
  </div>
</body>
</html>`;
}
