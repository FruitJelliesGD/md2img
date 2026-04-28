<template>
  <div
    class="flex items-center justify-end px-4 py-1 text-xs border-t"
    :class="theme === 'dark'
      ? 'bg-gray-900 border-gray-700 text-gray-400'
      : 'bg-gray-50 border-gray-200 text-gray-500'"
  >
    <span>行 {{ stats.lines }}</span>
    <span class="mx-2">·</span>
    <span>词 {{ stats.words }}</span>
    <span class="mx-2">·</span>
    <span>字符 {{ stats.chars }}</span>
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