<script setup>
import Spinner from "~/components/Spinner.vue"
const { data, pending } = useLazyFetch("/api/reviews?limit=9")
</script>

<template>
  <div class="w-full">
    <div class="flex w-fit justify-start">
      <h1
        class="my-4 border-l-4 border-yellow-500 pl-2 text-2xl font-bold tracking-wide"
      >
        Most Rated
      </h1>
    </div>
    <div v-if="pending">
      <div
        class="z-50 flex animate-pulse flex-wrap items-start justify-start gap-4 md:flex-nowrap"
      >
        <div
          class="h-96 w-32 min-w-[110px] flex-1 transform rounded bg-gray-300 transition-all duration-300 ease-in-out dark:bg-zinc-800 md:w-full md:min-w-fit md:flex-auto"
          v-for="i in 9"
          :key="i"
        ></div>
      </div>
    </div>
    <div
      v-else
      class="z-50 flex flex-wrap items-start justify-start gap-4 md:flex-nowrap"
    >
      <div
        class="h-96 w-32 min-w-[110px] flex-1 transform transition-all duration-300 ease-in-out md:w-full md:min-w-fit md:flex-auto md:hover:w-[calc(100%+64rem)] md:hover:grow-[4]"
        v-for="likedEntertainment in data"
        :key="likedEntertainment._id"
      >
        <NuxtLink
          :to="`/details/${likedEntertainment.entertainment.type}/${likedEntertainment.entertainment.id}`"
          class="group relative z-0 block h-full w-full cursor-pointer overflow-hidden rounded bg-cover bg-center shadow-2xl"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/w500/${likedEntertainment.entertainment.info.poster})`
          }"
        >
          <div
            class="absolute bottom-0 flex h-auto w-full select-none items-end p-2 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100"
          >
            <div class="flex flex-col justify-center gap-1 p-2">
              <h1 class="break-words font-semibold line-clamp-1">
                {{ likedEntertainment.entertainment.info.title }}
              </h1>
              <div class="flex items-center gap-1">
                <IconsStarFilled class="h-6 w-6 text-yellow-500" />
                <p class="text-sm">
                  {{ likedEntertainment.average.toFixed(1) }}
                </p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
