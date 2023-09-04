<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    score: number
  }>(),
  {
    score: 0
  }
)

const generateStroke = computed(() => {
  return `stroke-dasharray: ${props.score * 10}, 100;`
})

const strokeColor = computed(() => {
  return props.score >= 5 ? "stroke-yellow-500" : "stroke-red-500"
})
</script>

<template>
  <div
    v-if="props.score > 0"
    class="rounded bg-gray-500/20 px-2 !text-lg !font-semibold !text-white backdrop-blur-md"
  >
    {{ score.toFixed(1).replace(".0", "") }}
  </div>
</template>
