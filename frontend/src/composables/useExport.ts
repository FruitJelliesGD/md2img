import { ref } from "vue";
import { toPng, toJpeg, toCanvas } from "html-to-image";

export type ExportFormat = "png" | "jpeg" | "webp";

export interface ExportOptions {
  format: ExportFormat;
  width: number;
  quality: number;
}

function getBaseOptions(theme: "light" | "dark") {
  return {
    pixelRatio: 2,
    backgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
    style: {
      transform: "scale(1)",
      transformOrigin: "top left" as const,
    },
  };
}

function triggerDownload(blob: Blob, format: ExportFormat) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `markdown.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useExport() {
  const isExporting = ref(false);
  const error = ref<string | null>(null);

  async function downloadImage(
    element: HTMLElement,
    options: ExportOptions,
    theme: "light" | "dark"
  ): Promise<void> {
    isExporting.value = true;
    error.value = null;

    try {
      const baseOpts = getBaseOptions(theme);
      const originalWidth = element.style.width;
      const originalMinWidth = element.style.minWidth;
      element.style.width = `${options.width}px`;
      element.style.minWidth = `${options.width}px`;

      try {
        let blob: Blob;

        if (options.format === "png") {
          const dataUrl = await toPng(element, baseOpts);
          const response = await fetch(dataUrl);
          blob = await response.blob();
        } else if (options.format === "jpeg") {
          const dataUrl = await toJpeg(element, { ...baseOpts, quality: options.quality });
          const response = await fetch(dataUrl);
          blob = await response.blob();
        } else {
          const canvas = await toCanvas(element, baseOpts);
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

        triggerDownload(blob, options.format);
      } finally {
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

  async function copyToClipboard(
    element: HTMLElement,
    options: ExportOptions,
    theme: "light" | "dark"
  ): Promise<void> {
    isExporting.value = true;
    error.value = null;

    try {
      const dataUrl = await toPng(element, getBaseOptions(theme));
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
