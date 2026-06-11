import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import markedFootnote from "marked-footnote";
import { markedEmoji } from "marked-emoji";
import { customMarkdownExtensions } from "./markdownExtensions";
import { emojiDefinitions } from "./emojiDefinitions";

let configured = false;

export function configureMarked() {
  if (configured) return;
  configured = true;

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  marked.use(
    markedKatex({
      throwOnError: false,
      displayMode: false,
    }) as any,
    markedFootnote({}) as any,
    markedEmoji({ emojis: emojiDefinitions } as any) as any,
    customMarkdownExtensions as any
  );
}
