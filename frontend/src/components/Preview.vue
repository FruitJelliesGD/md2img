<template>
  <div
    ref="previewRef"
    class="h-full overflow-auto p-8"
    :class="theme === 'dark' ? 'bg-[#0d1117]' : 'bg-white'"
  >
    <div
      class="markdown-body mx-auto"
      :class="theme === 'dark' ? 'markdown-body-dark' : 'markdown-body-light'"
      v-html="html"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  html: string;
  theme: "light" | "dark";
}>();

const previewRef = ref<HTMLDivElement | null>(null);

defineExpose({
  getPreviewElement: () => previewRef.value,
});
</script>