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
  <div v-if="props.score > 0" class="-mt-[25px] h-4">
    <svg class="flex items-center" width="40" height="40">
      <circle
        class="fill-gray-900"
        :class="strokeColor"
        stroke-width="2.3"
        r="15.4"
        cx="20"
        cy="20"
        :style="generateStroke"
      ></circle>
      <text
        x="49%"
        y="53%"
        dominant-baseline="middle"
        text-anchor="middle"
        class="fill-white text-sm font-bold"
      >
        {{ score }}
      </text>
    </svg>
  </div>
</template>
