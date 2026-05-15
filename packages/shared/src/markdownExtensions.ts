import type { MarkedExtension } from "marked";

/**
 * Custom marked extension for superscript syntax: X^2^ → <sup>2</sup>
 */
const superscript = {
  name: "superscript",
  level: "inline" as const,
  start(src: string) {
    return src.indexOf("^");
  },
  tokenizer(src: string) {
    const match = src.match(/^\^([^\s^]+)\^/);
    if (match) {
      return {
        type: "superscript",
        raw: match[0],
        text: match[1],
      };
    }
  },
  renderer(token: any) {
    return `<sup>${token.text}</sup>`;
  },
};

/**
 * Custom marked extension for subscript syntax: H~2~O → H<sub>2</sub>O
 */
const subscript = {
  name: "subscript",
  level: "inline" as const,
  start(src: string) {
    return src.indexOf("~");
  },
  tokenizer(src: string) {
    const match = src.match(/^~([^\s~]+)~/);
    if (match) {
      return {
        type: "subscript",
        raw: match[0],
        text: match[1],
      };
    }
  },
  renderer(token: any) {
    return `<sub>${token.text}</sub>`;
  },
};

/**
 * Custom marked extension for highlight syntax: ==text== → <mark>text</mark>
 */
const highlight = {
  name: "highlight",
  level: "inline" as const,
  start(src: string) {
    return src.indexOf("==");
  },
  tokenizer(src: string) {
    const match = src.match(/^==([^\s=]+)==/);
    if (match) {
      return {
        type: "highlight",
        raw: match[0],
        text: match[1],
      };
    }
  },
  renderer(token: any) {
    return `<mark>${token.text}</mark>`;
  },
};

export const customMarkdownExtensions: MarkedExtension = {
  extensions: [superscript as any, subscript as any, highlight as any],
};
