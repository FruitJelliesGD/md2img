import { ref, computed } from 'vue';
import { Template, getTemplate } from '@md2img/shared';

const activeTemplateId = ref<string>('');

export function useTemplates() {
  const activeTemplate = computed<Template | null>(() => {
    return activeTemplateId.value ? getTemplate(activeTemplateId.value) ?? null : null;
  });

  function setTemplate(templateId: string) {
    activeTemplateId.value = templateId;
  }

  function clearTemplate() {
    activeTemplateId.value = '';
  }

  function applyTemplateCSS(content: string): string {
    if (!activeTemplate.value) return content;

    const wrappedContent = `<div class="${activeTemplate.value.id}-template">${content}</div>`;

    const styleTag = `<style>${activeTemplate.value.css}</style>`;

    return `${styleTag}${wrappedContent}`;
  }

  return {
    activeTemplateId,
    activeTemplate,
    setTemplate,
    clearTemplate,
    applyTemplateCSS
  };
}
