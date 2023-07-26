<script setup lang="ts">
const { data } = defineProps<{
  data: {
    id: number
    name: string
    profile_path: string
    attr: string
  }
}>()
</script>

<template>
  <NuxtLink
    class="flex w-full max-w-[100px] flex-shrink-0 select-none snap-start flex-col transition-opacity hover:opacity-75 md:max-w-[140px]"
    :to="`/details/person/${data.id}`"
  >
    <div class="flex w-full flex-col items-center justify-center rounded">
      <div
        v-if="data.profile_path"
        :style="{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${data.profile_path})`
        }"
        class="h-32 w-full flex-shrink-0 rounded bg-white bg-cover bg-center bg-no-repeat dark:bg-black md:h-[240px]"
      ></div>
      <div
        v-else
        class="flex h-32 w-full flex-shrink-0 items-center justify-center rounded bg-gray-800 font-semibold !text-white md:h-[240px]"
      >
        No Image
      </div>

      <div
        class="mt-2 flex h-full w-full flex-col items-center justify-center pt-2 text-center font-maven"
      >
        <p class="line-clamp-2 break-words font-semibold">
          {{ data.name }}
        </p>
        <p class="line-clamp-1 break-words" v-if="data.attr">
          {{ data.attr }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
