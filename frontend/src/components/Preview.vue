<template>
  <div
    ref="previewRef"
    class="h-full overflow-auto p-8 bg-white dark:bg-[#0d1117]"
  >
    <div
      ref="contentRef"
      class="markdown-body mx-auto max-w-4xl"
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
