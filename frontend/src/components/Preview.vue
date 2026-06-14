<template>
  <div
    ref="previewRef"
    class="h-full overflow-auto p-8 bg-white dark:bg-[#0d1117]"
  >
    <div v-if="activeTemplate" v-html="templateStyle"></div>
    <div
      ref="contentRef"
      class="markdown-body mx-auto max-w-4xl"
      :class="activeTemplate ? `${activeTemplate.id}-template` : ''"
      v-html="html"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { useTemplates } from "../composables/useTemplates";

const { activeTemplate } = useTemplates();

const props = defineProps<{
  html: string;
  theme: "light" | "dark";
}>();

const templateStyle = computed(() => {
  return activeTemplate.value ? `<style>${activeTemplate.value.css}</style>` : '';
});

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
  getScrollElement: () => previewRef.value,
});
</script>
