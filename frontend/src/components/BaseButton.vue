<template>
  <button
    :aria-label="ariaLabel"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClasses"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  ariaLabel?: string;
  disabled?: boolean;
}>(), {
  variant: "secondary",
  size: "md",
  disabled: false,
});

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const variantClasses = computed(() => {
  const base = props.size === "sm"
    ? "px-2.5 py-1 text-xs"
    : "px-3.5 py-1.5 text-sm";

  switch (props.variant) {
    case "primary":
      return `${base} text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-sm`;
    case "ghost":
      return `${base} text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400`;
    case "secondary":
    default:
      return `${base} text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-400 shadow-sm`;
  }
});
</script>
