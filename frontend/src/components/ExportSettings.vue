<template>
  <div class="flex items-center gap-3">
    <!-- Format selector -->
    <select
      :value="format"
      aria-label="Export format"
      class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
      @change="$emit('update:format', ($event.target as HTMLSelectElement).value as ExportFormat)"
    >
      <option value="png">
        PNG
      </option>
      <option value="jpeg">
        JPEG
      </option>
      <option value="webp">
        WebP
      </option>
    </select>

    <!-- Width input -->
    <div class="flex items-center gap-1">
      <input
        type="number"
        :value="width"
        aria-label="Image width in pixels"
        min="100"
        max="4096"
        step="100"
        class="w-20 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
        @input="$emit('update:width', Math.min(Math.max(Number(($event.target as HTMLInputElement).value), 100), 4096))"
      >
      <span class="text-xs text-gray-500 dark:text-gray-400">px</span>
    </div>

    <!-- Quality slider (only for jpeg/webp) -->
    <div
      v-if="format !== 'png'"
      class="flex items-center gap-2"
    >
      <label class="text-xs text-gray-500 dark:text-gray-400">{{ t('export.quality') }}</label>
      <input
        type="range"
        :value="quality"
        min="0.1"
        max="1"
        step="0.01"
        class="w-20"
        @input="$emit('update:quality', Number(($event.target as HTMLInputElement).value))"
      >
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ Math.round(quality * 100) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExportFormat } from "../composables/useExport";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

defineProps<{
  format: ExportFormat;
  width: number;
  quality: number;
}>();

defineEmits<{
  (e: "update:format", value: ExportFormat): void;
  (e: "update:width", value: number): void;
  (e: "update:quality", value: number): void;
}>();
</script>
