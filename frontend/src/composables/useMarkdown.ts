import { ref, computed, watch } from "vue";
import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import markedFootnote from "marked-footnote";
import { markedEmoji } from "marked-emoji";
import { customMarkdownExtensions } from "../utils/markdownExtensions";
import { emojiDefinitions } from "../utils/emojiDefinitions";

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Register all extensions
marked.use(
  markedKatex({
    throwOnError: false,
    displayMode: false,
  }),
  markedFootnote({}),
  markedEmoji({ emojis: emojiDefinitions } as any),
  customMarkdownExtensions
);

export function useMarkdown(source: () => string) {
  const html = ref("");

  // Debounced update
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const updateHtml = () => {
    html.value = marked.parse(source()) as string;
  };

  watch(
    source,
    () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(updateHtml, 200);
    },
    { immediate: true }
  );

  // Stats
  const stats = computed(() => {
    const text = source();
    const lines = text.split("\n").length;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { lines, chars, words };
  });

  return {
    html,
    stats,
  };
}