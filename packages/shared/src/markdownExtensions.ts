import type { MarkedExtension } from "marked";
import { marked } from "marked";

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

const heroBlock = {
  name: "hero",
  level: "block" as const,
  start(src: string) {
    return src.match(/^```hero\s+(.+)/m)?.index;
  },
  tokenizer(src: string) {
    const match = src.match(/^```hero\s+(.+)\n([\s\S]*?)^```\n?/m);
    if (match) {
      return {
        type: "hero",
        raw: match[0],
        name: match[1].trim(),
        text: match[2].trim(),
      };
    }
  },
  renderer(token: any) {
    const heroName = token.name;
    const content = token.text;
    const lines = content.split("\n");

    let devNotes = "";
    let changes = "";
    const abilities: { name: string; icon: string; changes: string }[] = [];
    let currentSection = "";
    let currentAbility = "";
    let currentAbilityIcon = "";
    let currentAbilityChanges: string[] = [];
    let currentChanges: string[] = [];
    let currentDevNotes: string[] = [];

    for (const line of lines) {
      const abilityMatch = line.match(/^####\s+(.+)/);
      const abilityIconMatch = line.match(/^icon:\s*(.+)/);

      if (abilityIconMatch) {
        currentAbilityIcon = abilityIconMatch[1].trim();
        continue;
      }

      if (line.startsWith("### ")) {
        if (currentAbility && currentAbilityChanges.length > 0) {
          abilities.push({
            name: currentAbility,
            icon: currentAbilityIcon,
            changes: currentAbilityChanges.join("\n"),
          });
          currentAbility = "";
          currentAbilityIcon = "";
          currentAbilityChanges = [];
        }
        if (currentChanges.length > 0) {
          changes = currentChanges.join("\n");
          currentChanges = [];
        }
        if (currentDevNotes.length > 0) {
          devNotes = currentDevNotes.join("\n");
          currentDevNotes = [];
        }
        currentSection = line.replace("### ", "").trim();
        continue;
      }

      if (line.startsWith("#### ")) {
        if (currentAbility && currentAbilityChanges.length > 0) {
          abilities.push({
            name: currentAbility,
            icon: currentAbilityIcon,
            changes: currentAbilityChanges.join("\n"),
          });
        }
        currentAbility = line.replace("#### ", "").trim();
        currentAbilityIcon = "";
        currentAbilityChanges = [];
        continue;
      }

      if (currentSection === "Dev Notes") {
        currentDevNotes.push(line);
      } else if (currentSection === "Changes") {
        currentChanges.push(line);
      } else if (currentAbility) {
        currentAbilityChanges.push(line);
      }
    }

    if (currentAbility && currentAbilityChanges.length > 0) {
      abilities.push({
        name: currentAbility,
        icon: currentAbilityIcon,
        changes: currentAbilityChanges.join("\n"),
      });
    }
    if (currentChanges.length > 0) {
      changes = currentChanges.join("\n");
    }
    if (currentDevNotes.length > 0) {
      devNotes = currentDevNotes.join("\n");
    }

    const devNotesHtml = devNotes
      ? `<div class="PatchNotes-dev PatchNotesHeroUpdate-dev">${marked.parse(devNotes.trim())}</div>`
      : "";

    const changesHtml = changes
      ? `<div class="PatchNotesHeroUpdate-generalUpdates">${marked.parse(changes.trim())}</div>`
      : "";

    const abilitiesHtml = abilities.length > 0
      ? `<div class="PatchNotesHeroUpdate-abilitiesList">${abilities
          .map(
            (a) => `
        <div class="PatchNotesAbilityUpdate">
          ${a.icon ? `<div class="PatchNotesAbilityUpdate-icon-container"><img class="PatchNotesAbilityUpdate-icon" src="${a.icon}"></div>` : `<div class="PatchNotesAbilityUpdate-icon-container--empty"></div>`}
          <div class="PatchNotesAbilityUpdate-text">
            <div class="PatchNotesAbilityUpdate-name">${a.name}</div>
            <div class="PatchNotesAbilityUpdate-detailList">${marked.parse(a.changes.trim())}</div>
          </div>
        </div>`
          )
          .join("")}</div>`
      : "";

    return `
<div class="PatchNotesHeroUpdate">
  <div class="PatchNotesHeroUpdate-header">
    <h5 class="PatchNotesHeroUpdate-name">${heroName}</h5>
  </div>
  <div class="PatchNotesHeroUpdate-body">
    ${devNotesHtml}
    ${changesHtml}
    ${abilitiesHtml}
  </div>
</div>`;
  },
};

export const customMarkdownExtensions: MarkedExtension = {
  extensions: [superscript as any, subscript as any, highlight as any, heroBlock as any],
};
