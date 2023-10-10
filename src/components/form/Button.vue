<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset"
    color?: "primary" | "secondary" | "danger"
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: "button",
    color: "primary",
    disabled: false,
    loading: false
  }
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex min-h-[45.6px] cursor-pointer items-center justify-center rounded-lg border border-transparent px-4 py-2 text-base font-medium text-gray-900 transition-colors duration-75 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
    :class="{
      'bg-yellow-400 enabled:hover:bg-yellow-500': color === 'primary'
    }"
  >
    <div v-if="loading" class="flex animate-pulse gap-1.5">
      <span class="h-2 w-2 rounded-full bg-gray-400"></span>
      <span class="h-2 w-2 rounded-full bg-gray-500"></span>
      <span class="h-2 w-2 rounded-full bg-gray-600"></span>
    </div>
    <slot v-else />
  </button>
</template>
