<template>
  <div
    ref="previewRef"
    class="h-full overflow-auto p-8"
    :class="theme === 'dark' ? 'bg-[#0d1117]' : 'bg-white'"
  >
    <div
      ref="contentRef"
      class="markdown-body mx-auto"
      :class="theme === 'dark' ? 'markdown-body-dark' : 'markdown-body-light'"
      v-html="html"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

const props = defineProps<{
  html: string;
  theme: "light" | "dark";
}>();

const previewRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
let savedScrollTop = 0;

watch(
  () => props.html,
  () => {
    if (previewRef.value) {
      savedScrollTop = previewRef.value.scrollTop;
    }
  }
);

watch(
  () => props.html,
  () => {
    nextTick(() => {
      if (previewRef.value) {
        previewRef.value.scrollTop = savedScrollTop;
      }
    });
  }
);

defineExpose({
  getPreviewElement: () => previewRef.value,
  getContentElement: () => contentRef.value,
});
</script>
