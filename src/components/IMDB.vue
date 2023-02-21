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
    class="bg-[#F5C518] text-black font-bold inline-flex items-center justify-center pr-2 h-6 rounded hover:bg-opacity-80 transition"
  >
    <IconsImdb class="w-auto h-4" />
    {{ props.score.toFixed(1) }}
  </div>
</template>
