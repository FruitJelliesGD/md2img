<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-40 flex items-center justify-center"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-black/50" />
        <div
          ref="modalRef"
          role="dialog"
          aria-modal="true"
          :aria-label="t('api.title')"
          class="relative w-full max-w-3xl max-h-[85vh] overflow-auto rounded-xl shadow-2xl mx-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        >
          <div class="sticky top-0 flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90">
            <h2 class="text-xl font-bold">{{ t('api.title') }}</h2>
            <button
              :aria-label="t('export.close')"
              class="text-2xl leading-none hover:opacity-70 transition-opacity"
              @click="$emit('close')"
            >
              &times;
            </button>
          </div>

          <div class="px-6 py-4 space-y-6 text-sm leading-relaxed">
            <section>
              <h3 class="text-lg font-semibold mb-2">{{ t('api.endpoint') }}</h3>
              <div class="px-4 py-2 rounded-lg font-mono text-sm bg-gray-100 dark:bg-gray-800">
                <span class="text-green-500 font-bold">POST</span>
                <span class="ml-2">/api/convert</span>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold mb-2">{{ t('api.headers') }}</h3>
              <div class="px-4 py-2 rounded-lg font-mono text-sm bg-gray-100 dark:bg-gray-800">
                <div>Content-Type: application/json</div>
                <div v-if="authHint" class="text-yellow-500 mt-1">
                  Authorization: Bearer &lt;API_KEY&gt;
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold mb-2">{{ t('api.requestBody') }}</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-gray-800">
                      <th class="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">{{ t('api.fields') }}</th>
                      <th class="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">{{ t('api.type') }}</th>
                      <th class="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">{{ t('api.required') }}</th>
                      <th class="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">{{ t('api.defaultValue') }}</th>
                      <th class="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">{{ t('api.description') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700 font-mono">markdown</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">string</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700 text-green-500 font-bold">{{ t('api.yes') }}</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">-</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">{{ t('api.markdownContent') }}</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700 font-mono">theme</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">string</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">{{ t('api.no') }}</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">"light"</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">"light" | "dark"</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700 font-mono">format</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">string</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">{{ t('api.no') }}</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">"png"</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">"png" | "jpeg" | "webp"</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700 font-mono">width</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">number</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">{{ t('api.no') }}</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">800</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">{{ t('api.imageWidth') }}</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700 font-mono">quality</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">number</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">{{ t('api.no') }}</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">0.92</td>
                      <td class="px-3 py-2 border border-gray-200 dark:border-gray-700">{{ t('api.qualityDesc') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold mb-2">{{ t('api.response') }}</h3>
              <p>{{ t('api.success') }}: 200, image binary data.</p>
            </section>

            <section v-if="quotaHint">
              <h3 class="text-lg font-semibold mb-2">{{ t('api.quotaTitle') }}</h3>
              <p>{{ quotaEnabled ? t('api.quotaEnabled') : t('api.quotaDisabled') }}</p>
            </section>
          </div>
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
  authHint?: boolean;
  quotaHint?: boolean;
  quotaEnabled?: boolean;
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
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
