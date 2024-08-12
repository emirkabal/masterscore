<script setup lang="ts">
defineProps<{
  rating: number | undefined
}>()
</script>
<template>
  <span
    v-if="rating"
    class="duration-2 flex h-6 select-none items-center justify-center gap-1 rounded-full px-2 text-xs font-bold uppercase text-white transition-colors"
    v-tooltip="{
      content:
        rating >= 9
          ? $t('mranking.tooltips.masterpiece')
          : rating >= 8
            ? $t('mranking.tooltips.perfect')
            : rating >= 7
              ? $t('mranking.tooltips.good')
              : rating >= 5 && rating < 7
                ? $t('mranking.tooltips.mixed')
                : $t('mranking.tooltips.poor')
    }"
    :class="{
      'border border-brand !bg-black/40 !text-brand backdrop-blur-sm': rating >= 9,
      'bg-yellow-300 font-maven !font-semibold !text-black': rating >= 8 && rating < 9,
      'bg-green-600': rating >= 7 && rating < 8,
      'bg-gray-500': rating >= 5 && rating < 7,
      'bg-red-500': rating < 5
    }"
  >
    <Icon
      :name="`${
        rating >= 9
          ? 'solar:cup-star-bold'
          : rating >= 8 && rating < 9
            ? 'solar:stars-bold'
            : rating >= 7
              ? 'ic:round-check-circle'
              : rating >= 5 && rating < 7
                ? 'ic:baseline-sentiment-dissatisfied'
                : 'ic:outline-mood-bad'
      }`"
      class="h-4 w-4"
    />
    {{
      rating >= 9
        ? $t("mranking.masterpiece")
        : rating >= 8 && rating < 9
          ? $t("mranking.perfect")
          : rating >= 7
            ? $t("mranking.good")
            : rating >= 5 && rating < 7
              ? $t("mranking.mixed")
              : $t("mranking.poor")
    }}
  </span>
</template>
