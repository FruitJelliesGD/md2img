import { describe, it, expect } from "vitest";
import { customMarkdownExtensions } from "../markdownExtensions";

describe("customMarkdownExtensions", () => {
  const extensions = customMarkdownExtensions.extensions;

  it("should have 4 extensions", () => {
    expect(extensions).toHaveLength(4);
  });

  it("extension names should be superscript, subscript, highlight, hero", () => {
    const names = extensions.map((e: any) => e.name);
    expect(names).toContain("superscript");
    expect(names).toContain("subscript");
    expect(names).toContain("highlight");
    expect(names).toContain("hero");
  });
});
