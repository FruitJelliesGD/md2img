import { watch, onBeforeUnmount, type Ref } from "vue";

export function useSyncScroll(
  editorScroll: Ref<HTMLElement | null>,
  previewScroll: Ref<HTMLElement | null>,
  enabled: Ref<boolean>
) {
  let isSyncing = false;
  let currentEditor: HTMLElement | null = null;
  let currentPreview: HTMLElement | null = null;

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
    if (currentEditor && currentPreview) {
      syncScroll(currentEditor, currentPreview);
    }
  }

  function handlePreviewScroll() {
    if (currentEditor && currentPreview) {
      syncScroll(currentPreview, currentEditor);
    }
  }

  function attach() {
    detach();
    currentEditor = editorScroll.value;
    currentPreview = previewScroll.value;
    currentEditor?.addEventListener("scroll", handleEditorScroll, { passive: true });
    currentPreview?.addEventListener("scroll", handlePreviewScroll, { passive: true });
  }

  function detach() {
    currentEditor?.removeEventListener("scroll", handleEditorScroll);
    currentPreview?.removeEventListener("scroll", handlePreviewScroll);
    currentEditor = null;
    currentPreview = null;
  }

  watch(
    [editorScroll, previewScroll],
    () => {
      attach();
    },
    { flush: "post" }
  );

  onBeforeUnmount(() => {
    detach();
  });

  return { attach, detach };
}
