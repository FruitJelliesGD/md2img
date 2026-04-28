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
      const isDark = theme === "dark";
      const bgColor = isDark ? "#0d1117" : "#ffffff";

      // Temporarily set the element to the desired export width
      const originalWidth = element.style.width;
      const originalMinWidth = element.style.minWidth;
      element.style.width = `${options.width}px`;
      element.style.minWidth = `${options.width}px`;

      try {
        let blob: Blob;

        if (options.format === "png") {
          const dataUrl = await toPng(element, {
            pixelRatio: 2,
            backgroundColor: bgColor,
            style: {
              transform: "scale(1)",
              transformOrigin: "top left",
            },
          });
          const response = await fetch(dataUrl);
          blob = await response.blob();
        } else if (options.format === "jpeg") {
          const dataUrl = await toJpeg(element, {
            pixelRatio: 2,
            quality: options.quality,
            backgroundColor: bgColor,
            style: {
              transform: "scale(1)",
              transformOrigin: "top left",
            },
          });
          const response = await fetch(dataUrl);
          blob = await response.blob();
        } else {
          // WebP: use toCanvas then convert to blob
          const canvas = await toCanvas(element, {
            pixelRatio: 2,
            backgroundColor: bgColor,
            style: {
              transform: "scale(1)",
              transformOrigin: "top left",
            },
          });
          blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => {
                if (b) resolve(b);
                else reject(new Error("Failed to convert canvas to WebP blob"));
              },
              "image/webp",
              options.quality
            );
          });
        }

        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `markdown.${options.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } finally {
        // Restore original element width
        element.style.width = originalWidth;
        element.style.minWidth = originalMinWidth;
      }
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
    theme: "light" | "dark"
  ): Promise<void> {
    isExporting.value = true;
    error.value = null;

    try {
      const isDark = theme === "dark";
      const bgColor = isDark ? "#0d1117" : "#ffffff";

      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: bgColor,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

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
