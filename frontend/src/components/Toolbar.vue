<template>
  <div
    class="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-toolbar dark:shadow-toolbar-dark"
  >
    <!-- Left: Logo & Theme Toggle -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 class="text-lg font-bold text-gray-900 dark:text-white">
          md2img
        </h1>
      </div>
      <BaseButton size="sm" aria-label="Toggle theme" @click="$emit('toggleTheme')">
        <svg v-if="theme === 'dark'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        {{ theme === 'dark' ? t('theme.light') : t('theme.dark') }}
      </BaseButton>
      <BaseButton size="sm" aria-label="Toggle language" @click="$emit('toggleLocale')">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {{ locale === 'zh-CN' ? 'EN' : '中' }}
      </BaseButton>
    </div>

    <!-- Center: Export Settings -->
    <ExportSettings
      :format="format"
      :width="width"
      :quality="quality"
      @update:format="$emit('update:format', $event)"
      @update:width="$emit('update:width', $event)"
      @update:quality="$emit('update:quality', $event)"
    />

    <!-- Right: Actions -->
    <div class="flex items-center gap-2">
      <BaseButton
        variant="primary"
        :disabled="isExporting"
        aria-label="Download image"
        @click="$emit('download')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {{ isExporting ? t('export.downloading') : t('export.download') }}
      </BaseButton>
      <BaseButton
        :disabled="isExporting"
        aria-label="Copy to clipboard"
        @click="$emit('copy')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {{ t('export.copy') }}
      </BaseButton>
      <BaseButton
        size="sm"
        aria-label="Show API documentation"
        @click="$emit('showApiDoc')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        API
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExportSettings from "./ExportSettings.vue";
import BaseButton from "./BaseButton.vue";
import type { ExportFormat } from "../composables/useExport";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

defineProps<{
  theme: "light" | "dark";
  locale: string;
  format: ExportFormat;
  width: number;
  quality: number;
  isExporting: boolean;
}>();

defineEmits<{
  (e: "toggleTheme"): void;
  (e: "toggleLocale"): void;
  (e: "update:format", value: ExportFormat): void;
  (e: "update:width", value: number): void;
  (e: "update:quality", value: number): void;
  (e: "download"): void;
  (e: "copy"): void;
  (e: "showApiDoc"): void;
}>();
</script>
