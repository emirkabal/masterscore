<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset"
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: "button",
    disabled: false,
    loading: false
  }
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex min-h-[45.6px] cursor-pointer items-center justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-base font-medium text-white transition-colors duration-75 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 enabled:hover:bg-yellow-600"
  >
    <div v-if="loading" class="flex animate-pulse gap-1.5">
      <span class="h-2 w-2 rounded-full bg-gray-400"></span>
      <span class="h-2 w-2 rounded-full bg-gray-500"></span>
      <span class="h-2 w-2 rounded-full bg-gray-600"></span>
    </div>
    <slot v-else />
  </button>
</template>
