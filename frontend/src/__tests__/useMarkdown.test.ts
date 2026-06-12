import { describe, it, expect } from "vitest";
import { marked } from "marked";

describe("Markdown rendering pipeline", () => {
  it("should parse basic markdown to HTML", () => {
    const result = marked.parse("# Hello") as string;
    expect(result).toContain("<h1>");
    expect(result).toContain("Hello");
  });

  it("should parse bold text", () => {
    const result = marked.parse("**bold**") as string;
    expect(result).toContain("<strong>");
    expect(result).toContain("bold");
  });

  it("should parse code blocks", () => {
    const result = marked.parse("```js\nconst x = 1;\n```") as string;
    expect(result).toContain("<code");
    expect(result).toContain("const x = 1;");
  });

  it("should parse tables", () => {
    const md = "| a | b |\n|---|---|\n| 1 | 2 |";
    const result = marked.parse(md) as string;
    expect(result).toContain("<table");
    expect(result).toContain("<td>");
  });

  it("should parse blockquotes", () => {
    const result = marked.parse("> quote") as string;
    expect(result).toContain("<blockquote>");
  });
});
