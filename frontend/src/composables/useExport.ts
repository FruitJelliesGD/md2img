import { ref } from "vue";
import { toPng, toJpeg, toCanvas } from "html-to-image";
import { useTemplates } from "./useTemplates";

export type ExportFormat = "png" | "jpeg" | "webp";

export interface ExportOptions {
  format: ExportFormat;
  width: number;
  quality: number;
}

function getBaseOptions(theme: "light" | "dark", templateActive: boolean) {
  return {
    pixelRatio: 2,
    backgroundColor: templateActive ? "#004da7" : (theme === "dark" ? "#0d1117" : "#ffffff"),
  };
}

function triggerDownload(blob: Blob, format: ExportFormat) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const now = new Date();
  const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  a.download = `markdown-${ts}.${format}`;
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
  theme: "light" | "dark",
  templateActive: boolean
): Promise<Blob> {
  const origWidth = element.style.width;
  const origMinWidth = element.style.minWidth;
  element.style.width = `${options.width}px`;
  element.style.minWidth = `${options.width}px`;

  const restoreHeight = unconstrainElement(element);

  try {
    const baseOpts = getBaseOptions(theme, templateActive);

    let dataUrl: string;
    if (options.format === "png") {
      dataUrl = await toPng(element, baseOpts);
    } else if (options.format === "jpeg") {
      dataUrl = await toJpeg(element, { ...baseOpts, quality: options.quality });
    } else {
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
    }

    const resp = await fetch(dataUrl);
    return resp.blob();
  } finally {
    element.style.width = origWidth;
    element.style.minWidth = origMinWidth;
    restoreHeight();
  }
}

async function copyBlobToClipboard(blob: Blob): Promise<void> {
  if (navigator.clipboard && typeof navigator.clipboard.write === "function") {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return;
  }

  // Fallback: download the image instead of copying
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clipboard-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useExport() {
  const isExporting = ref(false);
  const { activeTemplate } = useTemplates();

  async function downloadImage(
    element: HTMLElement,
    options: ExportOptions,
    theme: "light" | "dark"
  ): Promise<void> {
    isExporting.value = true;
    try {
      const blob = await captureImage(element, options, theme, !!activeTemplate.value);
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
      const pngBlob = await captureImage(element, { ...options, format: "png" }, theme, !!activeTemplate.value);
      await copyBlobToClipboard(pngBlob);
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
