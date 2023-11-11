<script setup lang="ts">
defineProps<{
  rating: number | undefined
}>()
</script>
<template>
  <span
    v-if="rating"
    class="duration-2 flex select-none items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase text-white transition-colors"
    :class="{
      'bg-yellow-400 font-maven !font-black !text-black': rating >= 9,
      'bg-green-500': rating >= 7,
      'bg-yellow-500': rating >= 4 && rating < 7,
      'bg-red-500': rating < 4
    }"
  >
    <Icon
      :name="`ic:${
        rating >= 9
          ? 'round-star'
          : rating >= 7
          ? 'round-check-circle'
          : rating >= 4 && rating < 7
          ? 'baseline-sentiment-dissatisfied'
          : 'outline-mood-bad'
      }`"
      class="h-4 w-4"
    />
    {{
      rating >= 9
        ? $t("mranking.masterpiece")
        : rating >= 7
        ? $t("mranking.good")
        : rating >= 4 && rating < 7
        ? $t("mranking.mixed")
        : $t("mranking.poor")
    }}
  </span>
</template>
