export const CSS_VARIABLES_LIGHT = `
  :root {
    --md-text: #1f2328;
    --md-bg: #ffffff;
    --md-link: #0969da;
    --md-border: #d1d9e0;
    --md-muted: #636c76;
    --md-code-bg: rgba(175, 184, 193, 0.2);
    --md-pre-bg: #f6f8fa;
    --md-kbd-bg: #fafbfc;
    --md-mark-bg: #fff8c5;
    --md-table-header-bg: #f6f8fa;
  }
`;

export const CSS_VARIABLES_DARK = `
  [data-theme="dark"] {
    --md-text: #e6edf3;
    --md-bg: #0d1117;
    --md-link: #4493f8;
    --md-border: #30363d;
    --md-muted: #8b949e;
    --md-code-bg: rgba(110, 118, 129, 0.4);
    --md-pre-bg: #161b22;
    --md-kbd-bg: #161b22;
    --md-mark-bg: #3b2e00;
    --md-table-header-bg: #161b22;
  }
`;

export const MARKDOWN_CSS = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: var(--md-text);
    background-color: var(--md-bg);
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
  h1 { font-size: 2em; border-bottom: 1px solid var(--md-border); padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid var(--md-border); padding-bottom: 0.3em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1em; }
  p { margin-top: 0; margin-bottom: 16px; }
  a { color: var(--md-link); text-decoration: none; }
  a:hover { text-decoration: underline; }
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: var(--md-code-bg);
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  }
  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: var(--md-pre-bg);
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
    color: var(--md-muted);
    border-left: 0.25em solid var(--md-border);
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
    width: max-content;
    max-width: 100%;
    overflow: visible;
    margin-bottom: 16px;
  }
  table th, table td {
    padding: 6px 13px;
    border: 1px solid var(--md-border);
  }
  table th {
    font-weight: 600;
    background-color: var(--md-table-header-bg);
  }
  table tr:nth-child(2n) {
    background-color: var(--md-table-header-bg);
  }
  img { max-width: 100%; box-sizing: border-box; }
  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: var(--md-border);
    border: 0;
  }
  kbd {
    display: inline-block;
    padding: 3px 5px;
    font-size: 11px;
    line-height: 1;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    border-radius: 3px;
    background-color: var(--md-kbd-bg);
    border: 1px solid var(--md-border);
    color: var(--md-text);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  }
  mark {
    padding: 0.1em 0.3em;
    border-radius: 3px;
    background-color: var(--md-mark-bg);
    color: var(--md-text);
  }
  .footnotes {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--md-border);
    font-size: 0.875em;
    color: var(--md-muted);
  }
  .footnote-ref {
    font-size: 0.75em;
    vertical-align: super;
  }
`;

export const ALL_CSS = `${CSS_VARIABLES_LIGHT}${CSS_VARIABLES_DARK}${MARKDOWN_CSS}`;
