<template>
  <div
    class="h-screen flex flex-col"
    :class="theme === 'dark' ? 'bg-gray-900' : 'bg-white'"
  >
    <!-- Toolbar -->
    <Toolbar
      :theme="theme"
      :format="exportFormat"
      :width="exportWidth"
      :quality="exportQuality"
      :is-exporting="isExporting"
      @toggle-theme="toggleTheme"
      @update:format="exportFormat = $event"
      @update:width="exportWidth = $event"
      @update:quality="exportQuality = $event"
      @download="handleDownload"
      @copy="handleCopy"
      @show-api-doc="showApiDoc = true"
    />

    <!-- Main content: Editor + Preview -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Editor panel -->
      <div
        class="overflow-hidden"
        :style="{ width: editorWidth + '%' }"
        :class="theme === 'dark' ? 'bg-[#0d1117]' : 'bg-white'"
      >
        <Editor
          v-model="markdown"
          :theme="theme"
        />
      </div>

      <!-- Resizer -->
      <div
        class="resizer"
        :class="{ active: isResizing }"
        @mousedown="startResize"
      ></div>

      <!-- Preview panel -->
      <div
        class="overflow-hidden"
        :style="{ width: (100 - editorWidth) + '%' }"
      >
        <Preview
          ref="previewRef"
          :html="renderedHtml"
          :theme="theme"
        />
      </div>
    </div>

    <!-- Status bar -->
    <StatusBar :stats="stats" :theme="theme" />

    <!-- API Doc Modal -->
    <ApiDocModal
      :visible="showApiDoc"
      :theme="theme"
      @close="showApiDoc = false"
    />

    <!-- Toast -->
    <Toast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
import Toolbar from "./components/Toolbar.vue";
import StatusBar from "./components/StatusBar.vue";
import ApiDocModal from "./components/ApiDocModal.vue";
import Toast from "./components/Toast.vue";
import { useTheme } from "./composables/useTheme";
import { useMarkdown } from "./composables/useMarkdown";
import { useExport, type ExportFormat } from "./composables/useExport";

// Theme
const { theme, toggleTheme } = useTheme();

// Default markdown content
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

const markdown = ref(defaultMarkdown);

// Markdown rendering
const { html: renderedHtml, stats } = useMarkdown(() => markdown.value);

// Export
const { isExporting, downloadImage, copyToClipboard } = useExport();
const exportFormat = ref<ExportFormat>("png");
const exportWidth = ref(800);
const exportQuality = ref(0.92);

// Preview ref
const previewRef = ref<InstanceType<typeof Preview> | null>(null);

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

// Download handler
async function handleDownload() {
  try {
    const previewEl = previewRef.value?.getPreviewElement();
    if (!previewEl) {
      showToast("无法获取预览元素", "error");
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
    showToast("图片已下载", "success");
  } catch (e) {
    showToast("下载失败：" + (e instanceof Error ? e.message : "未知错误"), "error");
  }
}

// Copy handler
async function handleCopy() {
  try {
    const previewEl = previewRef.value?.getPreviewElement();
    if (!previewEl) {
      showToast("无法获取预览元素", "error");
      return;
    }
    await copyToClipboard(previewEl, theme.value);
    showToast("已复制到剪贴板", "success");
  } catch (e) {
    showToast("复制失败：" + (e instanceof Error ? e.message : "未知错误"), "error");
  }
}

// Resizer
const editorWidth = ref(50);
const isResizing = ref(false);

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
</script>