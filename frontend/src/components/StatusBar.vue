<template>
  <div
    role="status"
    aria-label="Document statistics"
    class="flex items-center justify-end px-4 py-1 text-xs border-t"
    :class="theme === 'dark'
      ? 'bg-gray-900 border-gray-700 text-gray-400'
      : 'bg-gray-50 border-gray-200 text-gray-500'"
  >
    <span
      v-if="stats.chars > 80000"
      class="mr-2 text-yellow-500"
    >
      {{ stats.chars >= 100000 ? '已达上限' : '即将达到字符上限' }}
    </span>
    <span>行 {{ stats.lines }}</span>
    <span class="mx-2">·</span>
    <span>词 {{ stats.words }}</span>
    <span class="mx-2">·</span>
    <span>字符 {{ stats.chars.toLocaleString() }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    lines: number;
    words: number;
    chars: number;
  };
  theme: "light" | "dark";
}>();
</script>