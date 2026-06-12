import { Template } from './types';

const overwatchCSS = `
.overwatch-template {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #e0e0e0;
  font-family: 'Segoe UI', Arial, sans-serif;
  padding: 2rem;
  border-radius: 8px;
}

.overwatch-template h1 {
  color: #00d4ff;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
}

.overwatch-template h2 {
  color: #ff9d00;
  font-size: 1.5rem;
  margin-top: 0;
  text-align: center;
}

.overwatch-template h3 {
  color: #00d4ff;
  border-bottom: 2px solid #00d4ff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.overwatch-template h4 {
  color: #ff9d00;
  margin-bottom: 0.5rem;
}

.overwatch-template ul {
  list-style-type: none;
  padding-left: 0;
}

.overwatch-template li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.overwatch-template li::before {
  content: '\\25B8';
  position: absolute;
  left: 0;
  color: #00d4ff;
}

.overwatch-template p {
  margin-bottom: 1rem;
}

.overwatch-template strong {
  color: #00d4ff;
}

.overwatch-template em {
  color: #ff9d00;
}
`;

export const overwatchTemplate: Template = {
  id: 'overwatch',
  name: 'Overwatch Patch Notes',
  description: 'Dark-themed template inspired by Overwatch patch notes',
  css: overwatchCSS,
  author: 'md2img',
  version: '1.0.0'
};

export const defaultTemplates: Template[] = [
  overwatchTemplate
];

export function getTemplate(id: string): Template | undefined {
  return defaultTemplates.find(t => t.id === id);
}

export function getAllTemplates(): Template[] {
  return [...defaultTemplates];
}
