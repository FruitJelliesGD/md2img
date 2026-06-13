# Overwatch-style Template System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a template system that allows users to generate Overwatch patch notes-style images from Markdown content.

**Architecture:** Add a template engine to the existing md2img project that supports custom CSS themes and layouts. The system will include an Overwatch-style template as the first implementation, with the ability to add more templates later.

**Tech Stack:** Vue 3 (frontend), TypeScript, CSS variables, existing Markdown rendering pipeline

---

## File Structure

- `packages/shared/src/templates/` - Template definitions and CSS
- `frontend/src/components/TemplateSelector.vue` - UI for selecting templates
- `frontend/src/composables/useTemplates.ts` - Template management composable
- `frontend/src/assets/templates/` - Template CSS files
- `backend/src/templates/` - Backend template support (if needed)

---

### Task 1: Create Template Type Definitions

**Covers:** Core template system architecture

**Files:**
- Create: `packages/shared/src/templates/types.ts`

- [ ] **Step 1: Create template type definitions**

```typescript
// packages/shared/src/templates/types.ts
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
```

- [ ] **Step 2: Export from shared package**

Add to `packages/shared/src/index.ts`:
```typescript
export * from './templates/types';
```

- [ ] **Step 3: Commit**

```bash
git add packages/shared/src/templates/types.ts packages/shared/src/index.ts
git commit -m "feat: add template type definitions"
```

---

### Task 2: Create Overwatch Template CSS

**Covers:** Overwatch-style visual design

**Files:**
- Create: `frontend/src/assets/templates/overwatch.css`

- [ ] **Step 1: Create Overwatch template CSS**

```css
/* frontend/src/assets/templates/overwatch.css */
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
  content: '▸';
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/assets/templates/overwatch.css
git commit -m "feat: add Overwatch template CSS"
```

---

### Task 3: Create Template Registry

**Covers:** Template management and loading

**Files:**
- Create: `packages/shared/src/templates/registry.ts`
- Create: `packages/shared/src/templates/index.ts`

- [ ] **Step 1: Create template registry**

```typescript
// packages/shared/src/templates/registry.ts
import { Template } from './types';

const overwatchCSS = `
/* Include the CSS from Task 2 here */
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
```

- [ ] **Step 2: Create template index**

```typescript
// packages/shared/src/templates/index.ts
export * from './types';
export * from './registry';
```

- [ ] **Step 3: Update shared package exports**

Add to `packages/shared/src/index.ts`:
```typescript
export * from './templates';
```

- [ ] **Step 4: Commit**

```bash
git add packages/shared/src/templates/registry.ts packages/shared/src/templates/index.ts packages/shared/src/index.ts
git commit -m "feat: add template registry with Overwatch template"
```

---

### Task 4: Create Template Selector Component

**Covers:** UI for template selection

**Files:**
- Create: `frontend/src/components/TemplateSelector.vue`

- [ ] **Step 1: Create TemplateSelector component**

```vue
<!-- frontend/src/components/TemplateSelector.vue -->
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/TemplateSelector.vue
git commit -m "feat: add TemplateSelector component"
```

---

### Task 5: Create Template Composable

**Covers:** Template application logic

**Files:**
- Create: `frontend/src/composables/useTemplates.ts`

- [ ] **Step 1: Create useTemplates composable**

```typescript
// frontend/src/composables/useTemplates.ts
import { ref, computed } from 'vue';
import { Template, getTemplate } from '@md2img/shared';

const activeTemplateId = ref<string>('');

export function useTemplates() {
  const activeTemplate = computed<Template | null>(() => {
    return activeTemplateId.value ? getTemplate(activeTemplateId.value) : null;
  });

  function setTemplate(templateId: string) {
    activeTemplateId.value = templateId;
  }

  function clearTemplate() {
    activeTemplateId.value = '';
  }

  function applyTemplateCSS(content: string): string {
    if (!activeTemplate.value) return content;
    
    // Wrap content in template container
    const wrappedContent = `<div class="${activeTemplate.value.id}-template">${content}</div>`;
    
    // Add template CSS
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/composables/useTemplates.ts
git commit -m "feat: add useTemplates composable"
```

---

### Task 6: Integrate Template Selector into Toolbar

**Covers:** UI integration

**Files:**
- Modify: `frontend/src/components/Toolbar.vue`

- [ ] **Step 1: Add TemplateSelector to Toolbar**

```vue
<!-- Add to TemplateSelector imports and usage in Toolbar.vue -->
<template>
  <!-- Existing toolbar content -->
  <div class="flex items-center space-x-4">
    <!-- Existing controls -->
    <TemplateSelector ref="templateSelector" />
  </div>
</template>

<script setup lang="ts">
// Existing imports
import TemplateSelector from './TemplateSelector.vue';

// Existing code
const templateSelector = ref<InstanceType<typeof TemplateSelector>>();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Toolbar.vue
git commit -m "feat: integrate TemplateSelector into Toolbar"
```

---

### Task 7: Apply Template to Export

**Covers:** Template application during export

**Files:**
- Modify: `frontend/src/composables/useExport.ts`

- [ ] **Step 1: Modify useExport to apply template**

```typescript
// Add to useExport.ts
import { useTemplates } from './useTemplates';

export function useExport() {
  const { applyTemplateCSS, activeTemplate } = useTemplates();
  
  // Existing code...
  
  async function exportImage() {
    // Get markdown content
    const markdownContent = getMarkdownContent();
    
    // Apply template if active
    const htmlContent = activeTemplate.value 
      ? applyTemplateCSS(markdownContent)
      : markdownContent;
    
    // Rest of existing export logic...
  }
  
  return {
    // Existing exports
    exportImage
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/composables/useExport.ts
git commit -m "feat: apply template during export"
```

---

### Task 8: Add Template Preview

**Covers:** Template preview in editor

**Files:**
- Modify: `frontend/src/components/Preview.vue`

- [ ] **Step 1: Add template preview to Preview component**

```vue
<!-- Add template CSS to preview head -->
<template>
  <div class="preview-container">
    <div v-if="activeTemplate" v-html="templateStyle"></div>
    <div class="preview-content" v-html="renderedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTemplates } from '../composables/useTemplates';

const { activeTemplate } = useTemplates();

const templateStyle = computed(() => {
  return activeTemplate.value ? `<style>${activeTemplate.value.css}</style>` : '';
});
</script>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Preview.vue
git commit -m "feat: add template preview in editor"
```

---

### Task 9: Add Template Tests

**Covers:** Unit tests for template system

**Files:**
- Create: `frontend/src/__tests__/templates.test.ts`

- [ ] **Step 1: Create template tests**

```typescript
// frontend/src/__tests__/templates.test.ts
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
    expect(overwatchTemplate.css).toContain('#00d4ff');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
cd frontend && pnpm test
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/__tests__/templates.test.ts
git commit -m "test: add template system unit tests"
```

---

### Task 10: Update Documentation

**Covers:** User documentation

**Files:**
- Modify: `README.md`
- Modify: `README.en.md`

- [ ] **Step 1: Add template documentation to README**

```markdown
## Template System

md2img supports custom templates for styling exported images.

### Built-in Templates

- **Overwatch Patch Notes**: Dark-themed template with blue accents, inspired by Overwatch patch notes

### Using Templates

1. Select a template from the dropdown in the toolbar
2. The preview will update to show the template style
3. Export the image to get the styled output

### Template Preview

Templates are applied in real-time in the preview panel, so you can see how your content will look before exporting.
```

- [ ] **Step 2: Commit**

```bash
git add README.md README.en.md
git commit -m "docs: add template system documentation"
```

---

## Execution Handoff

Now I need to ask the user about execution style.</think><tool_call>
<function=question>
<parameter=questions>[{"question": "Plan saved. How would you like to execute it?", "header": "Execution", "options": [{"label": "Subagent, always", "description": "Fresh subagent per task — remember for future sessions"}, {"label": "Subagent, this time", "description": "Fresh subagent per task — just this once"}, {"label": "Inline, always", "description": "Execute in this session — remember for future sessions"}, {"label": "Inline, this time", "description": "Execute in this session — just this once"}]}]