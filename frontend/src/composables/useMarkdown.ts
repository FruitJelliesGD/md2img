import { ref, computed, watch, onBeforeUnmount } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { configureMarked } from "@md2img/shared";

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

export function useMarkdown(source: () => string, options?: { debounceMs?: number }) {
  const html = ref("");
  const debounceMs = options?.debounceMs ?? 200;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const updateHtml = () => {
    html.value = DOMPurify.sanitize(marked.parse(source()) as string);
  };

  watch(
    source,
    () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(updateHtml, debounceMs);
    },
    { immediate: true }
  );

  const stats = computed(() => {
    const text = source();
    const lines = text.split("\n").length;
    const chars = text.length;
    const cjkChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || []).length;
    const nonCjk = text.replace(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, " ");
    const words = cjkChars + (nonCjk.trim() ? nonCjk.trim().split(/\s+/).length : 0);
    return { lines, chars, words };
  });

  onBeforeUnmount(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });

  return {
    html,
    stats,
  };
}
