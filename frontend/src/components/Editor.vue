<template>
  <div ref="editorContainer" class="h-full w-full overflow-hidden"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";

const props = defineProps<{
  modelValue: string;
  theme: "light" | "dark";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editorContainer = ref<HTMLDivElement | null>(null);
let editorView: EditorView | null = null;

function createTheme(dark: boolean) {
  return EditorView.theme({
    "&": {
      backgroundColor: dark ? "#0d1117" : "#ffffff",
      color: dark ? "#e6edf3" : "#1f2328",
    },
    ".cm-content": {
      caretColor: dark ? "#4493f8" : "#0969da",
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
      fontSize: "14px",
      lineHeight: "1.6",
      padding: "16px",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: dark ? "#4493f8" : "#0969da",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: dark ? "rgba(56, 139, 253, 0.3)" : "rgba(9, 105, 218, 0.2)",
    },
    ".cm-panels": {
      backgroundColor: dark ? "#161b22" : "#f6f8fa",
      color: dark ? "#e6edf3" : "#1f2328",
    },
    ".cm-gutters": {
      backgroundColor: dark ? "#0d1117" : "#ffffff",
      color: dark ? "#636c76" : "#636c76",
      borderRight: `1px solid ${dark ? "#21262d" : "#d1d9e0"}`,
    },
    ".cm-activeLineGutter": {
      backgroundColor: dark ? "#161b22" : "#f6f8fa",
    },
    ".cm-activeLine": {
      backgroundColor: dark ? "rgba(110, 118, 129, 0.1)" : "rgba(175, 184, 193, 0.1)",
    },
    ".cm-matchingBracket": {
      backgroundColor: dark ? "rgba(56, 139, 253, 0.3)" : "rgba(9, 105, 218, 0.2)",
      outline: `1px solid ${dark ? "#4493f8" : "#0969da"}`,
    },
  }, { dark });
}

function createEditor() {
  if (!editorContainer.value) return;

  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      emit("update:modelValue", update.state.doc.toString());
    }
  });

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      history(),
      bracketMatching(),
      syntaxHighlighting(defaultHighlightStyle),
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      createTheme(props.theme === "dark"),
      updateListener,
      EditorView.lineWrapping,
    ],
  });

  editorView = new EditorView({
    state,
    parent: editorContainer.value,
  });
}

// Watch for theme changes — destroy and recreate editor with new theme
watch(
  () => props.theme,
  () => {
    if (editorView) {
      const currentContent = editorView.state.doc.toString();
      editorView.destroy();
      editorView = null;
      // Recreate with current content
      if (editorContainer.value) {
        const updateListener = EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            emit("update:modelValue", update.state.doc.toString());
          }
        });

        const state = EditorState.create({
          doc: currentContent,
          extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            history(),
            bracketMatching(),
            syntaxHighlighting(defaultHighlightStyle),
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            keymap.of([...defaultKeymap, ...historyKeymap]),
            createTheme(props.theme === "dark"),
            updateListener,
            EditorView.lineWrapping,
          ],
        });

        editorView = new EditorView({
          state,
          parent: editorContainer.value,
        });
      }
    }
  }
);

// Watch for external content changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorView) {
      const currentValue = editorView.state.doc.toString();
      if (newValue !== currentValue) {
        editorView.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: newValue,
          },
        });
      }
    }
  }
);

onMounted(() => {
  createEditor();
});

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy();
    editorView = null;
  }
});
</script>