<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50"
      :class="typeClasses"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
}>();

const typeClasses = computed(() => {
  switch (props.type) {
    case "error":
      return "bg-red-600 text-white";
    case "info":
      return "bg-blue-600 text-white";
    case "success":
    default:
      return "bg-green-600 text-white";
  }
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>