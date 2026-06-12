import { ref, onMounted, onBeforeUnmount } from "vue";

export function useMediaQuery(query: string) {
  const matches = ref(false);

  function update() {
    matches.value = window.matchMedia(query).matches;
  }

  onMounted(() => {
    update();
    window.matchMedia(query).addEventListener("change", update);
  });

  onBeforeUnmount(() => {
    window.matchMedia(query).removeEventListener("change", update);
  });

  return matches;
}
