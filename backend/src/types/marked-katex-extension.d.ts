declare module "marked-katex-extension" {
  import type { MarkedExtension } from "marked";

  interface KatexOptions {
    throwOnError?: boolean;
    displayMode?: boolean;
    nonStandard?: boolean;
    trust?: boolean;
    strict?: boolean | string;
    macros?: Record<string, string>;
    errorColor?: string;
    delimiters?: Array<{
      left: string;
      right: string;
      display: boolean;
    }>;
    preProcess?: (math: string) => string;
    postProcess?: (element: HTMLElement) => void;
  }

  function markedKatex(options?: KatexOptions): MarkedExtension;

  export default markedKatex;
}
