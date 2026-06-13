import { describe, it, expect } from 'vitest';
import { getTemplate, getAllTemplates, overwatchTemplate } from '@md2img/shared';

describe('Template System', () => {
  it('should return all templates', () => {
    const templates = getAllTemplates();
    expect(templates).toHaveLength(1);
    expect(templates[0].id).toBe('overwatch');
  });

  it('should get template by id', () => {
    const template = getTemplate('overwatch');
    expect(template).toBeDefined();
    expect(template?.name).toBe('Overwatch Patch Notes');
  });

  it('should return undefined for unknown template', () => {
    const template = getTemplate('unknown');
    expect(template).toBeUndefined();
  });

  it('should have valid CSS', () => {
    expect(overwatchTemplate.css).toContain('.overwatch-template');
    expect(overwatchTemplate.css).toContain('#1d253a');
  });
});
