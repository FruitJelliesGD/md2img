<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-black/50" />
        <div
          ref="modalRef"
          role="dialog"
          aria-modal="true"
          :aria-label="t('shortcuts.title')"
          class="relative w-full max-w-md rounded-xl shadow-2xl mx-4 p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        >
          <h2 class="text-lg font-bold mb-4">{{ t('shortcuts.title') }}</h2>
          <div class="space-y-2">
            <div v-for="shortcut in shortcuts" :key="shortcut.keys" class="flex justify-between items-center py-1">
              <span class="text-sm">{{ shortcut.description }}</span>
              <kbd class="px-2 py-0.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
              >{{ shortcut.keys }}</kbd>
            </div>
          </div>
          <button
            class="mt-4 w-full px-4 py-2 text-sm rounded-md transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            @click="$emit('close')"
          >
            {{ t('export.close') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

defineProps<{
  visible: boolean;
  theme: "light" | "dark";
}>();

defineEmits<{
  (e: "close"): void;
}>();

const shortcuts = [
  { keys: "Ctrl+S", description: t("shortcuts.download") },
  { keys: "Ctrl+F", description: t("shortcuts.search") },
  { keys: "Ctrl+Shift+C", description: t("shortcuts.copy") },
  { keys: "Ctrl+Z", description: t("shortcuts.undo") },
  { keys: "Ctrl+Y", description: t("shortcuts.redo") },
  { keys: "Ctrl+/", description: t("shortcuts.toggleHelp") },
];
</script>
