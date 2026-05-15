import { ref } from "vue";
import { toPng, toJpeg, toCanvas } from "html-to-image";

export type ExportFormat = "png" | "jpeg" | "webp";

export interface ExportOptions {
  format: ExportFormat;
  width: number;
  quality: number;
}

export function useExport() {
  const isExporting = ref(false);
  const error = ref<string | null>(null);

  /**
   * Temporarily remove height constraints so html-to-image captures
   * the full content instead of only the visible viewport of a
   * scrollable container. Returns a restore function.
   */
  function unconstrainElement(el: HTMLElement): () => void {
    const origHeight = el.style.height;
    const origOverflow = el.style.overflow;
    const origMaxHeight = el.style.maxHeight;

    const fullHeight = el.scrollHeight;
    el.style.height = `${fullHeight}px`;
    el.style.overflow = "visible";
    el.style.maxHeight = "none";
    // Force reflow so computed styles pick up the new height
    void el.offsetHeight;

    return () => {
      el.style.height = origHeight;
      el.style.overflow = origOverflow;
      el.style.maxHeight = origMaxHeight;
    };
  }

  /**
   * Shared capture logic used by both download and copy.
   */
  async function captureImage(
    element: HTMLElement,
    options: ExportOptions,
    theme: "light" | "dark"
  ): Promise<Blob> {
    const isDark = theme === "dark";
    const bgColor = isDark ? "#0d1117" : "#ffffff";

    // Set export width
    const origWidth = element.style.width;
    const origMinWidth = element.style.minWidth;
    element.style.width = `${options.width}px`;
    element.style.minWidth = `${options.width}px`;

    // Unconstrain height so the full content is captured
    const restoreHeight = unconstrainElement(element);

    try {
      if (options.format === "png") {
        const dataUrl = await toPng(element, {
          pixelRatio: 2,
          backgroundColor: bgColor,
        });
        const resp = await fetch(dataUrl);
        return resp.blob();
      }

      if (options.format === "jpeg") {
        const dataUrl = await toJpeg(element, {
          pixelRatio: 2,
          quality: options.quality,
          backgroundColor: bgColor,
        });
        const resp = await fetch(dataUrl);
        return resp.blob();
      }

      // WebP — use canvas then convert to blob
      const canvas = await toCanvas(element, {
        pixelRatio: 2,
        backgroundColor: bgColor,
      });
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to convert canvas to WebP blob"));
          },
          "image/webp",
          options.quality,
        );
      });
    } finally {
      // Restore both width and height changes
      element.style.width = origWidth;
      element.style.minWidth = origMinWidth;
      restoreHeight();
    }
  }

  /**
   * Download image using html-to-image (pure frontend, no backend needed).
   * Supports PNG, JPEG, and WebP formats with 2x pixel ratio.
   */
  async function downloadImage(
    element: HTMLElement,
    options: ExportOptions,
    theme: "light" | "dark"
  ): Promise<void> {
    isExporting.value = true;
    error.value = null;

    try {
      const blob = await captureImage(element, options, theme);

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `markdown.${options.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Export failed";
      throw e;
    } finally {
      isExporting.value = false;
    }
  }

  /**
   * Copy preview to clipboard using html-to-image (pure frontend).
   */
  async function copyToClipboard(
    element: HTMLElement,
    options: ExportOptions,
    theme: "light" | "dark"
  ): Promise<void> {
    isExporting.value = true;
    error.value = null;

    try {
      const blob = await captureImage(element, options, theme);

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Copy failed";
      throw e;
    } finally {
      isExporting.value = false;
    }
  }

  return {
    isExporting,
    error,
    downloadImage,
    copyToClipboard,
  };
}
