<script lang="ts" setup>
const props = defineProps<{
  score: number | string
  to?: string
  platform: "imdb" | "rotten" | "metacritic" | "tmdb"
}>()
const formatted = computed(() => {
  if (typeof props.score === "number") return props.score.toFixed(1).replace(".0", "")
  return props.score
})
</script>
<template>
  <a
    target="_blank"
    rel="noopener noreferrer"
    :href="to || '#'"
    class="flex items-center gap-x-2 rounded bg-gray-400/20 px-2 py-1 text-sm font-semibold"
    :class="{
      'transition hover:bg-gray-400/40': to
    }"
  >
    <span class="text-white">{{ formatted }}</span>
    <IconsImdb v-if="platform === 'imdb'" class="h-5 fill-yellow-400" />
    <IconsTomato v-else-if="platform === 'rotten'" class="h-5" />
    <IconsTMDB v-else-if="platform === 'tmdb'" class="h-auto w-12" />
    <IconsMetacritic v-else-if="platform === 'metacritic'" class="h-5 w-5" />
  </a>
</template>

<style></style>
