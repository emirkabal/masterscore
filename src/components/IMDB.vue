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
    class="inline-flex h-6 items-center justify-center rounded bg-[#F5C518] pr-2 font-bold text-black transition hover:bg-opacity-80"
  >
    <IconsImdb class="h-4 w-auto" />
    {{ props.score.toFixed(1) }}
  </div>
</template>
