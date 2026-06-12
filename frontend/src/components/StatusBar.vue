<template>
  <div
    role="status"
    aria-label="Document statistics"
    class="flex items-center justify-end px-4 py-1 text-xs border-t bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
  >
    <span
      v-if="stats.chars > 80000"
      class="mr-2 text-yellow-500"
    >
      {{ stats.chars >= 100000 ? t('status.charLimitReached') : t('status.charLimitWarning') }}
    </span>
    <span>{{ t('status.lines') }} {{ stats.lines }}</span>
    <span class="mx-2">·</span>
    <span>{{ t('status.words') }} {{ stats.words }}</span>
    <span class="mx-2">·</span>
    <span>{{ t('status.chars') }} {{ stats.chars.toLocaleString() }}</span>
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
