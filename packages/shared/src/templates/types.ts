export interface Template {
  id: string;
  name: string;
  description: string;
  css: string;
  preview?: string;
  author?: string;
  version?: string;
}

export interface TemplateConfig {
  activeTemplate: string;
  customTemplates: Template[];
}

export interface TemplateContext {
  content: string;
  title?: string;
  subtitle?: string;
  metadata?: Record<string, any>;
}
