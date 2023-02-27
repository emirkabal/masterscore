<script setup>
const props = defineProps({
  score: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div
    class="inline-flex h-6 items-center justify-center rounded bg-gray-200 px-2 font-bold text-black transition hover:bg-opacity-80"
  >
    <IconsTomatoe class="mr-1 h-4 w-4"></IconsTomatoe>
    {{ props.score }}%
  </div>
</template>
