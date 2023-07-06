<script setup lang="ts">
const { data } = defineProps<{
  data: {
    url: string
    title: string
    poster: string
    backdrop: string
    release_date: string
    rating?: number
  }
}>()
</script>
<template>
  <NuxtLink
    :to="`/details/${data.url}`"
    class="flex w-full max-w-[100px] flex-shrink-0 select-none snap-start flex-col transition-opacity hover:opacity-75 md:max-w-[200px]"
  >
    <div
      class="h-40 w-full rounded-lg bg-cover bg-center bg-no-repeat md:h-[300px]"
      :style="{
        backgroundImage: `url(${$timage(data.poster, 'w300')})`
      }"
    ></div>
  </NuxtLink>
</template>
