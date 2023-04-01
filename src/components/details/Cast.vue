<script setup lang="ts">
const props = defineProps<{
  type?: string
  id?: string
  loading?: boolean
}>()

const { data, pending } = useLazyFetch<{
  [x: string]: any
}>(`/api/extra/credits/${props.id}?type=${props.type}`)
</script>
<template>
  <div class="overflow-hidden">
    <h1
      class="my-4 border-l-4 border-blue-700 pl-4 text-2xl font-bold tracking-wide"
    >
      Cast
    </h1>
    <div v-if="pending || loading" class="flex gap-2 overflow-x-hidden">
      <div class="flex flex-col" v-for="i in 8" :key="i">
        <div
          class="skeleton-effect h-64 w-[140px] rounded bg-gray-300 dark:bg-zinc-800 md:w-[160px]"
        ></div>
        <div
          class="skeleton-effect mt-2 h-2 w-4/5 self-center rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div
          class="skeleton-effect mt-2 h-2 w-3/4 self-center rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
      </div>
    </div>
    <OverflowBehavior v-else-if="data">
      <NuxtLink
        class="flex w-full max-w-[140px] flex-shrink-0 select-none flex-col transition-opacity hover:opacity-75 md:max-w-[160px]"
        v-for="cast in data.cast"
        :key="cast.id"
        :to="`/details/person/${cast.id}`"
      >
        <div class="flex w-full flex-col items-center justify-center rounded">
          <div
            v-if="cast.profile_path"
            :style="{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500${cast.profile_path})`
            }"
            class="h-64 w-full flex-shrink-0 rounded bg-white bg-cover bg-center bg-no-repeat dark:bg-black"
          ></div>
          <div
            v-else
            class="flex h-64 w-full flex-shrink-0 items-center justify-center rounded bg-gray-800 font-semibold !text-white"
          >
            No Image
          </div>

          <div
            class="mt-2 flex h-full w-full flex-col items-center justify-center py-2 text-center font-maven"
          >
            <p class="break-words font-semibold line-clamp-2">
              {{ cast.name }}
            </p>
            <p class="lineclamp-1 break-words">
              {{ cast.character }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </OverflowBehavior>
    <div v-else>
      <p class="text-center text-gray-500 dark:text-gray-400">No cast found</p>
    </div>
  </div>
</template>
