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
            <div v-for="shortcut in shortcuts" :key="shortcut.keys" class="flex justify-between items-center py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ shortcut.description }}</span>
              <kbd class="inline-flex items-center px-2 py-0.5 text-xs font-mono rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 shadow-sm"
              >{{ shortcut.keys }}</kbd>
            </div>
          </div>
          <button
            class="mt-4 w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
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
import { ref, watch, onBeforeUnmount } from "vue";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  theme: "light" | "dark";
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const modalRef = ref<HTMLDivElement | null>(null);
let previousFocus: HTMLElement | null = null;

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    emit("close");
    return;
  }
  if (e.key === "Tab" && modalRef.value) {
    const focusable = modalRef.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal && modalRef.value) {
      previousFocus = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeydown);
      const firstFocusable = modalRef.value.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) firstFocusable.focus();
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  if (previousFocus) previousFocus.focus();
});

const shortcuts = [
  { keys: "Ctrl+S", description: t("shortcuts.download") },
  { keys: "Ctrl+F", description: t("shortcuts.search") },
  { keys: "Ctrl+Shift+C", description: t("shortcuts.copy") },
  { keys: "Ctrl+Z", description: t("shortcuts.undo") },
  { keys: "Ctrl+Y", description: t("shortcuts.redo") },
  { keys: "Ctrl+/", description: t("shortcuts.toggleHelp") },
];
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from > div:last-child {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-to > div:last-child {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
