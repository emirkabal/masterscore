<script setup lang="ts">
const { data } = defineProps<{
  data: {
    url: string
    title: string
    poster?: string
    backdrop?: string
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
    <MasterImage
      v-if="data.poster"
      :source="$timage(data.poster, 'w300')"
      class="h-40 rounded-lg md:h-[300px]"
    />
    <div
      v-else
      class="flex h-40 w-full flex-shrink-0 items-center justify-center rounded bg-gray-800 text-center font-semibold !text-white md:h-[300px]"
    >
      {{ data.title }}
    </div>
  </NuxtLink>
</template>
