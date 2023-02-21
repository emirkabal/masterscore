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
    class="bg-gray-200 text-black font-bold inline-flex items-center justify-center px-2 h-6 rounded hover:bg-opacity-80 transition"
  >
    <IconsTomatoe class="w-4 h-4 mr-1"></IconsTomatoe>
    {{ props.score }}%
  </div>
</template>
