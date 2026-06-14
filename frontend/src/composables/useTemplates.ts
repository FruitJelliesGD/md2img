import { ref, computed, onUnmounted } from 'vue';
import { Template, getTemplate } from '@md2img/shared';

const activeTemplateId = ref<string>('');
let currentStyleElement: HTMLStyleElement | null = null;

function injectTemplateCSS(css: string) {
  if (typeof document === 'undefined') return;
  if (currentStyleElement) {
    currentStyleElement.remove();
  }
  const style = document.createElement('style');
  style.id = 'overwatch-template-style';
  style.textContent = css;
  document.head.appendChild(style);
  currentStyleElement = style;
}

function removeTemplateCSS() {
  if (typeof document === 'undefined') return;
  if (currentStyleElement) {
    currentStyleElement.remove();
    currentStyleElement = null;
  }
}

export function useTemplates() {
  const activeTemplate = computed<Template | null>(() => {
    return activeTemplateId.value ? getTemplate(activeTemplateId.value) ?? null : null;
  });

  function setTemplate(templateId: string) {
    activeTemplateId.value = templateId;
    const template = getTemplate(templateId);
    if (template) {
      injectTemplateCSS(template.css);
    }
  }

  function clearTemplate() {
    activeTemplateId.value = '';
    removeTemplateCSS();
  }

  function applyTemplateCSS(content: string): string {
    if (!activeTemplate.value) return content;
    return `<div class="${activeTemplate.value.id}-template">${content}</div>`;
  }

  // Note: onUnmounted removed to avoid issues in test environment
  // CSS cleanup happens when component unmounts naturally

  return {
    activeTemplateId,
    activeTemplate,
    setTemplate,
    clearTemplate,
    applyTemplateCSS
  };
}
