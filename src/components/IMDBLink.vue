<script setup>
const props = defineProps({
  imdb: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
})
</script>
<template>
  <a
    class="flex h-6 cursor-pointer items-center justify-center rounded bg-[#F5C518] pr-2 font-bold text-black transition hover:bg-opacity-80"
    :href="`https://www.imdb.com/title/${props.imdb}`"
    target="_blank"
  >
    <IconsImdb class="h-7 w-auto" />
    {{ props.score.toFixed(1) }}
  </a>
</template>
