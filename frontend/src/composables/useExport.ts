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

function unconstrainElement(el: HTMLElement): () => void {
  const origHeight = el.style.height;
  const origOverflow = el.style.overflow;
  const origMaxHeight = el.style.maxHeight;

  const fullHeight = el.scrollHeight;
  el.style.height = `${fullHeight}px`;
  el.style.overflow = "visible";
  el.style.maxHeight = "none";
  void el.offsetHeight;

  return () => {
    el.style.height = origHeight;
    el.style.overflow = origOverflow;
    el.style.maxHeight = origMaxHeight;
  };
}

async function captureImage(
  element: HTMLElement,
  options: ExportOptions,
  theme: "light" | "dark"
): Promise<Blob> {
  const origWidth = element.style.width;
  const origMinWidth = element.style.minWidth;
  element.style.width = `${options.width}px`;
  element.style.minWidth = `${options.width}px`;

  const restoreHeight = unconstrainElement(element);

  try {
    const baseOpts = getBaseOptions(theme);

    if (options.format === "png") {
      const dataUrl = await toPng(element, baseOpts);
      const resp = await fetch(dataUrl);
      return resp.blob();
    }

    if (options.format === "jpeg") {
      const dataUrl = await toJpeg(element, { ...baseOpts, quality: options.quality });
      const resp = await fetch(dataUrl);
      return resp.blob();
    }

    const canvas = await toCanvas(element, baseOpts);
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to convert canvas to WebP blob"));
        },
        "image/webp",
        options.quality
      );
    });
  } finally {
    element.style.width = origWidth;
    element.style.minWidth = origMinWidth;
    restoreHeight();
  }
}

export function useExport() {
  const isExporting = ref(false);

  async function downloadImage(
    element: HTMLElement,
    options: ExportOptions,
    theme: "light" | "dark"
  ): Promise<void> {
    isExporting.value = true;
    try {
      const blob = await captureImage(element, options, theme);
      triggerDownload(blob, options.format);
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
    try {
      const blob = await captureImage(element, options, theme);
      if (!navigator.clipboard?.write) {
        throw new Error("Clipboard API not supported in this browser");
      }
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    } finally {
      isExporting.value = false;
    }
  }

  return {
    isExporting,
    downloadImage,
    copyToClipboard,
  };
}
