import { ref, watch } from "vue";

export type Theme = "light" | "dark";

const theme = ref<Theme>(
  (localStorage.getItem("md2img-theme") as Theme) || "light"
);

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }

  function setTheme(t: Theme) {
    theme.value = t;
  }

  // Persist to localStorage
  watch(theme, (val) => {
    localStorage.setItem("md2img-theme", val);
    // Update document class for global dark mode
    if (val === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, { immediate: true });

  return {
    theme,
    toggleTheme,
    setTheme,
  };
}