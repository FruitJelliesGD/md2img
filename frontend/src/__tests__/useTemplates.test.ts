import { describe, it, expect, beforeEach } from 'vitest';
import { useTemplates } from '../composables/useTemplates';

describe('useTemplates composable', () => {
  let templates: ReturnType<typeof useTemplates>;

  beforeEach(() => {
    templates = useTemplates();
    templates.clearTemplate();
  });

  it('should set the active template', () => {
    templates.setTemplate('overwatch');
    expect(templates.activeTemplate.value).toBeDefined();
    expect(templates.activeTemplate.value?.id).toBe('overwatch');
  });

  it('should clear the active template', () => {
    templates.setTemplate('overwatch');
    templates.clearTemplate();
    expect(templates.activeTemplate.value).toBeNull();
  });

  it('should return content unchanged when no template is active', () => {
    const content = '<p>Hello World</p>';
    const result = templates.applyTemplateCSS(content);
    expect(result).toBe(content);
  });

  it('should wrap content in template container when template is active', () => {
    templates.setTemplate('overwatch');
    const content = '<p>Hello World</p>';
    const result = templates.applyTemplateCSS(content);
    expect(result).toContain('<div class="overwatch-template">');
    expect(result).toContain(content);
  });

  it('should wrap content in template container when template is active', () => {
    templates.setTemplate('overwatch');
    const content = '<p>Hello World</p>';
    const result = templates.applyTemplateCSS(content);
    expect(result).toContain('<div class="overwatch-template">');
    expect(result).toContain(content);
    expect(result).toContain('</div>');
  });
});
