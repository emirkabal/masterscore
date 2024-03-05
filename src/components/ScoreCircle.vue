<script setup lang="ts">
withDefaults(
  defineProps<{
    score: number
  }>(),
  {
    score: 0
  }
)
</script>

<template>
  <div
    v-if="score > 0"
    :class="{
      'bg-brand/40 text-yellow-300 backdrop-blur-sm': score >= 9,
      'bg-yellow-300 text-black': score >= 8 && score < 9,
      'bg-green-600 text-gray-50': score >= 7 && score < 8,
      'bg-gray-400/40 text-white backdrop-blur-sm': score >= 5 && score < 7,
      'bg-red-500 text-red-950': score < 5
    }"
    class="flex h-6 items-center gap-x-1 rounded-full px-2 !text-sm font-semibold shadow-lg"
  >
    <span>{{ score.toFixed(1).replace(".0", "") }}</span>
    <Logo :small="true" class="h-3 w-3 !text-current" />
  </div>
</template>
