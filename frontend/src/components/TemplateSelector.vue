<template>
  <div class="flex items-center gap-1.5">
    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
    <select
      v-model="selectedTemplate"
      class="min-w-[100px] px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
    >
      <option value="">Default</option>
      <option v-for="template in templates" :key="template.id" :value="template.id">
        {{ template.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Template, getAllTemplates } from '@md2img/shared';
import { useTemplates } from '../composables/useTemplates';

const { setTemplate, clearTemplate, activeTemplate } = useTemplates();

const templates = ref<Template[]>([]);
const selectedTemplate = ref<string>('');

watch(selectedTemplate, (newValue) => {
  if (newValue) {
    setTemplate(newValue);
  } else {
    clearTemplate();
  }
});

onMounted(() => {
  templates.value = getAllTemplates();
  if (activeTemplate.value) {
    selectedTemplate.value = activeTemplate.value.id;
  }
});

defineExpose({
  selectedTemplate
});
</script>
