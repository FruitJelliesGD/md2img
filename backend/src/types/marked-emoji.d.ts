declare module "marked-emoji" {
  import type { MarkedExtension } from "marked";

  interface MarkedEmojiOptions {
    /** Custom emoji definitions */
    definitions?: Record<string, string>;
    /** Whether to use Twemoji */
    twemoji?: boolean;
    /** Twemoji base URL */
    baseUrl?: string;
  }

  function markedEmoji(options?: MarkedEmojiOptions): MarkedExtension;

  export { markedEmoji };
}