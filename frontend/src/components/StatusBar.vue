<template>
  <div
    role="status"
    aria-label="Document statistics"
    class="flex items-center justify-between px-4 py-1.5 text-xs border-t bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-statusbar dark:shadow-statusbar-dark"
  >
    <div class="flex items-center gap-3">
      <span class="font-medium text-gray-600 dark:text-gray-300">md2img</span>
      <button
        :aria-label="syncScroll ? 'Disable sync scroll' : 'Enable sync scroll'"
        class="flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors"
        :class="syncScroll
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'"
        @click="$emit('toggleSyncScroll')"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        {{ syncScroll ? 'Sync' : 'Scroll' }}
      </button>
    </div>
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
  syncScroll: boolean;
}>();

defineEmits<{
  (e: "toggleSyncScroll"): void;
}>();
</script>
