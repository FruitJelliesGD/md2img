import { describe, it, expect } from "vitest";
import { marked } from "marked";
import { customMarkdownExtensions } from "../markdownExtensions";

describe("Hero Block Detection", () => {
  it("should not render hero block as code block", () => {
    marked.use(customMarkdownExtensions);
    
    const testMd = "```hero 路霸\n### Dev Notes\n> 测试\n```";
    const result = marked.parse(testMd) as string;
    
    // Should NOT contain code block markers
    expect(result).not.toContain("<pre>");
    expect(result).not.toContain("<code");
    
    // Should contain hero block
    expect(result).toContain("PatchNotesHeroUpdate");
    expect(result).toContain("路霸");
  });

  it("should handle hero block with abilities and icons", () => {
    marked.use(customMarkdownExtensions);
    
    const testMd = "```hero 朱诺\n### Abilities\n\n#### Mediblaster\nicon: https://example.com/icon.png\n- 伤害增加\n```";
    const result = marked.parse(testMd) as string;
    
    expect(result).toContain("PatchNotesHeroUpdate");
    expect(result).toContain("朱诺");
    expect(result).toContain("Mediblaster");
    expect(result).toContain("https://example.com/icon.png");
  });

  it("should handle hero block with dev notes and changes", () => {
    marked.use(customMarkdownExtensions);
    
    const testMd = "```hero 猎空\n### Dev Notes\n> 这是开发者注释\n\n### Changes\n- 生命值增加\n- 技能冷却减少\n```";
    const result = marked.parse(testMd) as string;
    
    expect(result).toContain("PatchNotesHeroUpdate");
    expect(result).toContain("猎空");
    expect(result).toContain("PatchNotes-dev");
    expect(result).toContain("PatchNotesHeroUpdate-generalUpdates");
  });
});
