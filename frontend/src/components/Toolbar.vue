<template>
  <div
    class="flex items-center justify-between px-4 py-2 border-b"
    :class="theme === 'dark'
      ? 'bg-gray-900 border-gray-700 text-gray-200'
      : 'bg-gray-50 border-gray-200 text-gray-700'"
  >
    <!-- Left: Logo & Theme Toggle -->
    <div class="flex items-center gap-3">
      <h1 class="text-lg font-bold">md2img</h1>
      <button
        @click="$emit('toggleTheme')"
        class="px-3 py-1 text-sm rounded-md transition-colors"
        :class="theme === 'dark'
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
      >
        {{ theme === 'dark' ? '☀️ 亮色' : '🌙 暗色' }}
      </button>
    </div>

    <!-- Center: Export Settings -->
    <ExportSettings
      :format="format"
      :width="width"
      :quality="quality"
      :theme="theme"
      @update:format="$emit('update:format', $event)"
      @update:width="$emit('update:width', $event)"
      @update:quality="$emit('update:quality', $event)"
    />

    <!-- Right: Actions -->
    <div class="flex items-center gap-2">
      <button
        @click="$emit('download')"
        :disabled="isExporting"
        class="px-4 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ isExporting ? '导出中...' : '📥 下载图片' }}
      </button>
      <button
        @click="$emit('copy')"
        :disabled="isExporting"
        class="px-4 py-1.5 text-sm font-medium rounded-md border transition-colors"
        :class="theme === 'dark'
          ? 'border-gray-600 hover:bg-gray-700 text-gray-200 disabled:opacity-50'
          : 'border-gray-300 hover:bg-gray-100 text-gray-700 disabled:opacity-50'"
      >
        📋 复制
      </button>
      <button
        @click="$emit('showApiDoc')"
        class="px-3 py-1.5 text-sm rounded-md border transition-colors"
        :class="theme === 'dark'
          ? 'border-gray-600 hover:bg-gray-700 text-gray-200'
          : 'border-gray-300 hover:bg-gray-100 text-gray-700'"
      >
        📖 API
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExportSettings from "./ExportSettings.vue";
import type { ExportFormat } from "../composables/useExport";

defineProps<{
  theme: "light" | "dark";
  format: ExportFormat;
  width: number;
  quality: number;
  isExporting: boolean;
}>();

defineEmits<{
  (e: "toggleTheme"): void;
  (e: "update:format", value: ExportFormat): void;
  (e: "update:width", value: number): void;
  (e: "update:quality", value: number): void;
  (e: "download"): void;
  (e: "copy"): void;
  (e: "showApiDoc"): void;
}>();
</script>