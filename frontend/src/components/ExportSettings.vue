<template>
  <div class="flex items-center gap-3">
    <!-- Format selector -->
    <select
      :value="format"
      @change="$emit('update:format', ($event.target as HTMLSelectElement).value as ExportFormat)"
      class="px-2 py-1 text-sm rounded border bg-transparent"
      :class="theme === 'dark'
        ? 'border-gray-600 text-gray-200 bg-gray-800'
        : 'border-gray-300 text-gray-700 bg-white'"
    >
      <option value="png">PNG</option>
      <option value="jpeg">JPEG</option>
      <option value="webp">WebP</option>
    </select>

    <!-- Width input -->
    <div class="flex items-center gap-1">
      <input
        type="number"
        :value="width"
        @input="$emit('update:width', Number(($event.target as HTMLInputElement).value))"
        min="100"
        max="4096"
        step="100"
        class="w-20 px-2 py-1 text-sm rounded border bg-transparent"
        :class="theme === 'dark'
          ? 'border-gray-600 text-gray-200 bg-gray-800'
          : 'border-gray-300 text-gray-700 bg-white'"
      />
      <span class="text-xs" :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">px</span>
    </div>

    <!-- Quality slider (only for jpeg/webp) -->
    <div v-if="format !== 'png'" class="flex items-center gap-2">
      <label class="text-xs" :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">质量</label>
      <input
        type="range"
        :value="quality"
        @input="$emit('update:quality', Number(($event.target as HTMLInputElement).value))"
        min="0.1"
        max="1"
        step="0.01"
        class="w-20"
      />
      <span class="text-xs" :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">
        {{ Math.round(quality * 100) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExportFormat } from "../composables/useExport";

defineProps<{
  format: ExportFormat;
  width: number;
  quality: number;
  theme: "light" | "dark";
}>();

defineEmits<{
  (e: "update:format", value: ExportFormat): void;
  (e: "update:width", value: number): void;
  (e: "update:quality", value: number): void;
}>();
</script>