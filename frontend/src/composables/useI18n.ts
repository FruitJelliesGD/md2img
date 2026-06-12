import { ref, computed } from "vue";
import zhCN from "../locales/zh-CN";
import en from "../locales/en";

type Locale = "zh-CN" | "en";
type Messages = typeof zhCN;

const messages: Record<Locale, Messages> = { "zh-CN": zhCN, en };

const currentLocale = ref<Locale>(
  (localStorage.getItem("md2img-locale") as Locale) || "zh-CN"
);

export function useI18n() {
  function t(path: string): string {
    const keys = path.split(".");
    let result: any = messages[currentLocale.value];
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? path;
  }

  function setLocale(locale: Locale) {
    currentLocale.value = locale;
    localStorage.setItem("md2img-locale", locale);
  }

  function toggleLocale() {
    setLocale(currentLocale.value === "zh-CN" ? "en" : "zh-CN");
  }

  const locale = computed(() => currentLocale.value);

  return { t, setLocale, toggleLocale, locale };
}
