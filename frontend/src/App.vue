<template>
  <div
    class="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
  >
    <!-- Toolbar -->
    <Toolbar
      :theme="theme"
      :locale="locale"
      :format="exportFormat"
      :width="exportWidth"
      :quality="exportQuality"
      :is-exporting="isExporting"
      @toggle-theme="toggleTheme"
      @toggle-locale="toggleLocale"
      @update:format="exportFormat = $event"
      @update:width="exportWidth = $event"
      @update:quality="exportQuality = $event"
      @download="handleDownload"
      @copy="handleCopy"
      @show-api-doc="showApiDoc = true"
    />

    <!-- Mobile tab bar -->
    <div
      v-if="isMobile"
      role="tablist"
      class="flex border-b bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    >
      <button
        role="tab"
        :aria-selected="mobileTab === 'editor'"
        class="flex-1 py-2 text-sm font-medium transition-colors"
        :class="mobileTab === 'editor'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
        @click="mobileTab = 'editor'"
      >
        {{ t('export.editor') }}
      </button>
      <button
        role="tab"
        :aria-selected="mobileTab === 'preview'"
        class="flex-1 py-2 text-sm font-medium transition-colors"
        :class="mobileTab === 'preview'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
        @click="mobileTab = 'preview'"
      >
        {{ t('export.preview') }}
      </button>
    </div>

    <!-- Main content: Editor + Preview -->
    <div class="flex-1 flex overflow-hidden max-w-[2560px] mx-auto w-full">
      <!-- Editor panel -->
      <div
        v-show="!isMobile || mobileTab === 'editor'"
        class="overflow-hidden bg-white dark:bg-[#004da7]"
        :class="isMobile ? 'w-full' : ''"
        :style="isMobile ? {} : { width: editorWidth + '%' }"
      >
        <Editor
          ref="editorRef"
          v-model="markdown"
          :theme="theme"
        />
      </div>

      <!-- Resizer (desktop only) -->
      <div
        v-if="!isMobile"
        class="resizer"
        :class="{ active: isResizing }"
        @mousedown="startResize"
      />

      <!-- Preview panel -->
      <div
        v-show="!isMobile || mobileTab === 'preview'"
        class="overflow-hidden"
        :class="isMobile ? 'w-full' : ''"
        :style="isMobile ? {} : { width: (100 - editorWidth) + '%' }"
      >
        <Preview
          ref="previewRef"
          :html="renderedHtml"
          :theme="theme"
        />
      </div>
    </div>

    <!-- Status bar -->
    <StatusBar
      :stats="stats"
      :theme="theme"
      :sync-scroll="syncScrollEnabled"
      @toggle-sync-scroll="syncScrollEnabled = !syncScrollEnabled"
    />

    <!-- API Doc Modal -->
    <ApiDocModal
      :visible="showApiDoc"
      :theme="theme"
      @close="showApiDoc = false"
    />

    <ShortcutHelp
      :visible="showShortcutHelp"
      :theme="theme"
      @close="showShortcutHelp = false"
    />

    <!-- Toast -->
    <Toast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @pause="pauseToast"
      @resume="resumeToast"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch, defineAsyncComponent } from "vue";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
import Toolbar from "./components/Toolbar.vue";
import StatusBar from "./components/StatusBar.vue";
const ApiDocModal = defineAsyncComponent(() => import("./components/ApiDocModal.vue"));
const ShortcutHelp = defineAsyncComponent(() => import("./components/ShortcutHelp.vue"));
import Toast from "./components/Toast.vue";
import { useTheme } from "./composables/useTheme";
import { useMarkdown } from "./composables/useMarkdown";
import { useExport, type ExportFormat } from "./composables/useExport";
import { useI18n } from "./composables/useI18n";
import { useMediaQuery } from "./composables/useMediaQuery";
import { useSyncScroll } from "./composables/useSyncScroll";

const { theme, toggleTheme } = useTheme();
const { t, toggleLocale, locale } = useI18n();
const isMobile = useMediaQuery("(max-width: 768px)");
const mobileTab = ref<"editor" | "preview">("editor");

const defaultMarkdown = `# Welcome to md2img

## Markdown to Image Converter

This tool lets you **edit Markdown** and **export as images**.

### Features

- Real-time preview with GitHub-style rendering
- Export to PNG, JPEG, or WebP
- Dark and light theme support
- Adjustable image width and quality
- Copy to clipboard

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Table

| Feature | Status |
|---------|--------|
| Editor | ✅ |
| Preview | ✅ |
| Export | ✅ |
| API | ✅ |

> "The best way to predict the future is to invent it." — Alan Kay

---

Happy writing! ✨
`;

function loadPersisted<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const markdown = ref(loadPersisted("md2img-markdown", defaultMarkdown));
const exportFormat = ref<ExportFormat>(loadPersisted("md2img-export-format", "png"));
const exportWidth = ref(loadPersisted("md2img-export-width", 800));
const exportQuality = ref(loadPersisted("md2img-export-quality", 0.92));

let persistTimer: ReturnType<typeof setTimeout> | null = null;
let pendingWrite: (() => void) | null = null;

function persist(key: string, value: unknown) {
  if (persistTimer) clearTimeout(persistTimer);
  pendingWrite = () => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota errors
    }
  };
  persistTimer = setTimeout(pendingWrite, 500);
}

function flushPersist() {
  if (persistTimer) clearTimeout(persistTimer);
  if (pendingWrite) pendingWrite();
  pendingWrite = null;
}

watch(markdown, (v) => persist("md2img-markdown", v));
watch(exportFormat, (v) => persist("md2img-export-format", v));
watch(exportWidth, (v) => persist("md2img-export-width", v));
watch(exportQuality, (v) => persist("md2img-export-quality", v));

// Markdown rendering
const { html: renderedHtml, stats } = useMarkdown(() => markdown.value);

// Export
const { isExporting, downloadImage, copyToClipboard } = useExport();

// Preview ref
const previewRef = ref<InstanceType<typeof Preview> | null>(null);
const editorRef = ref<InstanceType<typeof Editor> | null>(null);

// Sync scroll
const syncScrollEnabled = ref(true);
const editorScrollEl = ref<HTMLElement | null>(null);
const previewScrollEl = ref<HTMLElement | null>(null);

watch(
  () => previewRef.value,
  (val) => {
    previewScrollEl.value = val?.getScrollElement() ?? null;
  }
);

watch(
  () => editorRef.value,
  (val) => {
    editorScrollEl.value = val?.getScrollElement() ?? null;
  }
);

useSyncScroll(editorScrollEl, previewScrollEl, syncScrollEnabled);

// Toast
const toast = reactive({
  visible: false,
  message: "",
  type: "success" as "success" | "error" | "info",
});

let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string, type: "success" | "error" | "info" = "success") {
  if (toastTimer) clearTimeout(toastTimer);
  toast.message = message;
  toast.type = type;
  toast.visible = true;
  toastTimer = setTimeout(() => {
    toast.visible = false;
  }, 2500);
}

function pauseToast() {
  if (toastTimer) clearTimeout(toastTimer);
}

function resumeToast() {
  toastTimer = setTimeout(() => {
    toast.visible = false;
  }, 2500);
}

// Download handler
async function handleDownload() {
  try {
    const previewEl = previewRef.value?.getPreviewElement();
    if (!previewEl) {
      showToast(t("errors.noPreview"), "error");
      return;
    }
    await downloadImage(
      previewEl,
      {
        format: exportFormat.value,
        width: exportWidth.value,
        quality: exportQuality.value,
      },
      theme.value
    );
    showToast(t("export.downloaded"), "success");
  } catch (e) {
    showToast(t("export.downloadFailed") + ": " + (e instanceof Error ? e.message : t("errors.unknownError")), "error");
  }
}

// Copy handler
async function handleCopy() {
  try {
    const previewEl = previewRef.value?.getPreviewElement();
    if (!previewEl) {
      showToast(t("errors.noPreview"), "error");
      return;
    }
    await copyToClipboard(
      previewEl,
      {
        format: exportFormat.value,
        width: exportWidth.value,
        quality: exportQuality.value,
      },
      theme.value
    );
    showToast(t("export.copied"), "success");
  } catch (e) {
    showToast(t("export.copyFailed") + ": " + (e instanceof Error ? e.message : t("errors.unknownError")), "error");
  }
}

// Resizer
const editorWidth = ref(loadPersisted("md2img-editor-width", 50));
const isResizing = ref(false);

watch(editorWidth, (v) => persist("md2img-editor-width", v));

function startResize(e: MouseEvent) {
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth = editorWidth.value;
  const containerWidth = (e.target as HTMLElement).parentElement?.clientWidth || window.innerWidth;

  function onMouseMove(e: MouseEvent) {
    const delta = e.clientX - startX;
    const newWidth = startWidth + (delta / containerWidth) * 100;
    editorWidth.value = Math.min(Math.max(newWidth, 20), 80);
  }

  function onMouseUp() {
    isResizing.value = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

// API doc modal
const showApiDoc = ref(false);

// Shortcut help modal
const showShortcutHelp = ref(false);

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  if (showApiDoc.value || showShortcutHelp.value) return;
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    handleDownload();
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
    e.preventDefault();
    handleCopy();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "/") {
    e.preventDefault();
    showShortcutHelp.value = !showShortcutHelp.value;
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("beforeunload", flushPersist);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("beforeunload", flushPersist);
});
</script>