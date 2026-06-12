import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";

export function useSyncScroll(
  editorScroll: Ref<HTMLElement | null>,
  previewScroll: Ref<HTMLElement | null>,
  enabled: Ref<boolean>
) {
  let isSyncing = false;

  function syncScroll(source: HTMLElement, target: HTMLElement) {
    if (isSyncing || !enabled.value) return;
    isSyncing = true;

    const sourceMax = source.scrollHeight - source.clientHeight;
    const targetMax = target.scrollHeight - target.clientHeight;

    if (sourceMax <= 0 || targetMax <= 0) {
      isSyncing = false;
      return;
    }

    const percentage = source.scrollTop / sourceMax;
    target.scrollTop = percentage * targetMax;

    requestAnimationFrame(() => {
      isSyncing = false;
    });
  }

  function handleEditorScroll() {
    if (editorScroll.value && previewScroll.value) {
      syncScroll(editorScroll.value, previewScroll.value);
    }
  }

  function handlePreviewScroll() {
    if (editorScroll.value && previewScroll.value) {
      syncScroll(previewScroll.value, editorScroll.value);
    }
  }

  function attach() {
    editorScroll.value?.addEventListener("scroll", handleEditorScroll, { passive: true });
    previewScroll.value?.addEventListener("scroll", handlePreviewScroll, { passive: true });
  }

  function detach() {
    editorScroll.value?.removeEventListener("scroll", handleEditorScroll);
    previewScroll.value?.removeEventListener("scroll", handlePreviewScroll);
  }

  onMounted(() => {
    attach();
  });

  onBeforeUnmount(() => {
    detach();
  });

  return { attach, detach };
}
