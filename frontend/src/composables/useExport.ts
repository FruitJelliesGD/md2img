import { ref } from "vue";
import { toPng, toJpeg, toCanvas } from "html-to-image";
import { useTemplates } from "./useTemplates";

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

function cloneElementWithTemplate(element: HTMLElement, applyTemplateCSS: (content: string) => string): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  const originalContent = clone.innerHTML;
  clone.innerHTML = applyTemplateCSS(originalContent);
  return clone;
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
  const { applyTemplateCSS } = useTemplates();

  async function downloadImage(
    element: HTMLElement,
    options: ExportOptions,
    theme: "light" | "dark"
  ): Promise<void> {
    isExporting.value = true;
    try {
      const clone = cloneElementWithTemplate(element, applyTemplateCSS);
      document.body.appendChild(clone);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "-9999px";

      try {
        const blob = await captureImage(clone, options, theme);
        triggerDownload(blob, options.format);
      } finally {
        document.body.removeChild(clone);
      }
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
      const clone = cloneElementWithTemplate(element, applyTemplateCSS);
      document.body.appendChild(clone);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "-9999px";

      try {
        const pngBlob = await captureImage(clone, { ...options, format: "png" }, theme);
        if (!navigator.clipboard?.write) {
          throw new Error("Clipboard API not supported in this browser");
        }
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": pngBlob }),
        ]);
      } finally {
        document.body.removeChild(clone);
      }
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
