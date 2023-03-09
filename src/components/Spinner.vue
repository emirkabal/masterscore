<script setup>
import { useDark } from "@vueuse/core"
const isDark = useDark()
const props = defineProps({
  color: {
    type: String,
    default: "#fff"
  }
})
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <div
      class="h-4 w-4 animate-pulse rounded-full bg-gray-300 dark:bg-zinc-500"
    ></div>
    <div
      class="h-4 w-4 animate-pulse rounded-full bg-gray-400 dark:bg-zinc-600"
    ></div>
    <div
      class="h-4 w-4 animate-pulse rounded-full bg-gray-500 dark:bg-zinc-700"
    ></div>
  </div>
</template>
