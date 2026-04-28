import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import markedFootnote from "marked-footnote";
import { markedEmoji } from "marked-emoji";
import { customMarkdownExtensions } from "./markdownExtensions";
import { emojiDefinitions } from "./emojiDefinitions";

// Register all extensions
marked.use(
  markedKatex({
    throwOnError: false,
    displayMode: false,
  }) as any,
  markedFootnote({}) as any,
  markedEmoji({ emojis: emojiDefinitions } as any) as any,
  customMarkdownExtensions as any
);

// GitHub-style CSS for light theme
const GITHUB_LIGHT_CSS = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #1f2328;
    background-color: #ffffff;
    padding: 32px;
    margin: 0;
    word-wrap: break-word;
  }
  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }
  h1 { font-size: 2em; border-bottom: 1px solid #d1d9e0; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #d1d9e0; padding-bottom: 0.3em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1em; }
  p { margin-top: 0; margin-bottom: 16px; }
  a { color: #0969da; text-decoration: none; }
  a:hover { text-decoration: underline; }
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(175, 184, 193, 0.2);
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  }
  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 6px;
    margin-bottom: 16px;
  }
  pre code {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border-radius: 0;
    font-size: 100%;
  }
  blockquote {
    margin: 0 0 16px 0;
    padding: 0 1em;
    color: #636c76;
    border-left: 0.25em solid #d1d9e0;
  }
  ul, ol {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 16px;
  }
  li + li { margin-top: 0.25em; }
  table {
    border-collapse: collapse;
    border-spacing: 0;
    display: block;
    width: max-content;
    max-width: 100%;
    overflow: auto;
    margin-bottom: 16px;
  }
  table th, table td {
    padding: 6px 13px;
    border: 1px solid #d1d9e0;
  }
  table th {
    font-weight: 600;
    background-color: #f6f8fa;
  }
  table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }
  img {
    max-width: 100%;
    box-sizing: border-box;
  }
  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: #d1d9e0;
    border: 0;
  }
  kbd {
    display: inline-block;
    padding: 3px 5px;
    font-size: 11px;
    line-height: 1;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    border-radius: 3px;
    background-color: #fafbfc;
    border: 1px solid #d1d9e0;
    color: #1f2328;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  }
  mark {
    padding: 0.1em 0.3em;
    border-radius: 3px;
    background-color: #fff8c5;
    color: #1f2328;
  }
  .footnotes {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #d1d9e0;
    font-size: 0.875em;
    color: #636c76;
  }
  .footnote-ref {
    font-size: 0.75em;
    vertical-align: super;
  }
`;

// GitHub-style CSS for dark theme
const GITHUB_DARK_CSS = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #e6edf3;
    background-color: #0d1117;
    padding: 32px;
    margin: 0;
    word-wrap: break-word;
  }
  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }
  h1 { font-size: 2em; border-bottom: 1px solid #30363d; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #30363d; padding-bottom: 0.3em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1em; }
  p { margin-top: 0; margin-bottom: 16px; }
  a { color: #4493f8; text-decoration: none; }
  a:hover { text-decoration: underline; }
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(110, 118, 129, 0.4);
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  }
  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #161b22;
    border-radius: 6px;
    margin-bottom: 16px;
  }
  pre code {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border-radius: 0;
    font-size: 100%;
  }
  blockquote {
    margin: 0 0 16px 0;
    padding: 0 1em;
    color: #8b949e;
    border-left: 0.25em solid #30363d;
  }
  ul, ol {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 16px;
  }
  li + li { margin-top: 0.25em; }
  table {
    border-collapse: collapse;
    border-spacing: 0;
    display: block;
    width: max-content;
    max-width: 100%;
    overflow: auto;
    margin-bottom: 16px;
  }
  table th, table td {
    padding: 6px 13px;
    border: 1px solid #30363d;
  }
  table th {
    font-weight: 600;
    background-color: #161b22;
  }
  table tr:nth-child(2n) {
    background-color: #161b22;
  }
  img {
    max-width: 100%;
    box-sizing: border-box;
  }
  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: #30363d;
    border: 0;
  }
  kbd {
    display: inline-block;
    padding: 3px 5px;
    font-size: 11px;
    line-height: 1;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    border-radius: 3px;
    background-color: #161b22;
    border: 1px solid #30363d;
    color: #e6edf3;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  }
  mark {
    padding: 0.1em 0.3em;
    border-radius: 3px;
    background-color: #3b2e00;
    color: #e6edf3;
  }
  .footnotes {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #30363d;
    font-size: 0.875em;
    color: #8b949e;
  }
  .footnote-ref {
    font-size: 0.75em;
    vertical-align: super;
  }
`;

export interface TemplateOptions {
  markdown: string;
  theme: "light" | "dark";
  width: number;
}

export function generateHTML(options: TemplateOptions): string {
  const { markdown, theme, width } = options;
  const htmlContent = marked.parse(markdown) as string;
  const css = theme === "dark" ? GITHUB_DARK_CSS : GITHUB_LIGHT_CSS;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.45/dist/katex.min.css"
    crossorigin="anonymous"
  />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html { margin: 0; padding: 0; }
    ${css}
  </style>
</head>
<body>
  <div class="markdown-body" style="max-width: ${width}px; margin: 0 auto;">
    ${htmlContent}
  </div>
</body>
</html>`;
}