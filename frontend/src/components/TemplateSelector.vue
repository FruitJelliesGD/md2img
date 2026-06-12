<template>
  <div class="template-selector">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Template
    </label>
    <select
      v-model="selectedTemplate"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
    >
      <option value="">None (Default)</option>
      <option v-for="template in templates" :key="template.id" :value="template.id">
        {{ template.name }}
      </option>
    </select>
    <p v-if="selectedTemplate" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ currentTemplate?.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Template, getAllTemplates, getTemplate } from '@md2img/shared';

const templates = ref<Template[]>([]);
const selectedTemplate = ref<string>('');

const currentTemplate = computed(() => {
  return selectedTemplate.value ? getTemplate(selectedTemplate.value) : null;
});

onMounted(() => {
  templates.value = getAllTemplates();
});

defineExpose({
  selectedTemplate,
  currentTemplate
});
</script>
