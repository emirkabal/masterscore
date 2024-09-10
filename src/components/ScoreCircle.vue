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
      'border border-brand bg-black/40 text-brand backdrop-blur-sm': score >= 9,
      'bg-yellow-300 text-black': score >= 8 && score < 9,
      'bg-green-600 text-gray-50': score >= 7 && score < 8,
      'bg-gray-500 text-white': score >= 5 && score < 7,
      'bg-red-500 text-red-950': score < 5
    }"
    class="flex h-6 select-none items-center gap-x-0.5 rounded-full px-2 !text-sm font-bold shadow-lg"
  >
    <Icon name="material-symbols:star-rounded" class="-ml-[0.1px] h-4 w-4" />
    <span class="pr-0.5 leading-none">{{ score.toFixed(1).replace(".0", "") }}</span>
    <!-- <Logo :small="true" class="h-3 w-3 !text-current" /> -->
  </div>
</template>
