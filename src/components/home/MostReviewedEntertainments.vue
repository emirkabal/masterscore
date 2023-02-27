<script setup>
import Spinner from "~/components/Spinner.vue"
const { data, pending } = useLazyFetch("/api/reviews?limit=9")
</script>

<template>
  <div v-if="pending" class="flex justify-center">
    <Spinner color="#000" />
  </div>
  <div v-else class="m-auto w-full px-4 md:px-0">
    <div class="flex w-full justify-center md:w-fit md:justify-start">
      <h1 class="my-4 border-yellow-500 pl-2 text-2xl font-bold md:border-l-4">
        Most Rated
      </h1>
    </div>
    <div
      class="z-50 flex flex-wrap items-start justify-center gap-4 md:flex-nowrap"
    >
      <div
        class="h-96 w-28 grow-0 transform transition-all duration-300 ease-in-out hover:w-[calc(10%+4rem)] hover:grow-[4] md:w-full md:hover:w-[calc(100%+64rem)]"
        v-for="likedEntertainment in data"
        :key="likedEntertainment._id"
      >
        <router-link
          :to="`/details/${likedEntertainment.entertainment.type}/${likedEntertainment.entertainment.id}`"
          class="group relative z-0 block h-full w-full cursor-pointer overflow-hidden rounded bg-cover bg-center shadow-2xl"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/w300_and_h450_bestv2/${likedEntertainment.entertainment.info.poster})`
          }"
        >
          <div
            class="absolute bottom-0 flex h-auto w-full select-none items-end p-2 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100"
          >
            <div class="flex flex-col justify-center gap-1 p-2">
              <h1 class="line-clamp-1 break-words font-semibold">
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
        </router-link>
      </div>
    </div>
  </div>
</template>
