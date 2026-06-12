<template>
  <div
    role="status"
    aria-label="Document statistics"
    class="flex items-center justify-between px-4 py-1.5 text-xs border-t bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-statusbar dark:shadow-statusbar-dark"
  >
    <span class="font-medium text-gray-600 dark:text-gray-300">md2img</span>
    <div class="flex items-center gap-4">
      <span
        v-if="stats.chars > 80000"
        class="px-2 py-0.5 rounded-full text-xs font-medium"
        :class="stats.chars >= 100000
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'"
      >
        {{ stats.chars >= 100000 ? t('status.charLimitReached') : t('status.charLimitWarning') }}
      </span>
      <span>{{ t('status.lines') }} {{ stats.lines }}</span>
      <span class="text-gray-300 dark:text-gray-600">|</span>
      <span>{{ t('status.words') }} {{ stats.words }}</span>
      <span class="text-gray-300 dark:text-gray-600">|</span>
      <span>{{ t('status.chars') }} {{ stats.chars.toLocaleString() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

defineProps<{
  stats: {
    lines: number;
    words: number;
    chars: number;
  };
}>();
</script>
