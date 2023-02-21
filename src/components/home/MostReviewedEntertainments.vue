<script setup>
import Spinner from "~/components/Spinner.vue"
const { data, pending } = useLazyFetch("/api/reviews?limit=9")
</script>

<template>
  <div v-if="pending" class="flex justify-center">
    <Spinner color="#000" />
  </div>
  <div v-else class="w-full m-auto px-4 md:px-0">
    <div class="flex justify-center md:justify-start w-full md:w-fit">
      <h1 class="text-2xl font-bold my-4 md:border-l-4 pl-2 border-yellow-500">
        Most Rated
      </h1>
    </div>
    <div
      class="flex items-start justify-center flex-wrap md:flex-nowrap gap-4 z-50"
    >
      <div
        class="h-96 w-28 md:w-full grow-0 hover:grow-[4] transition-all duration-300 ease-in-out transform hover:w-[calc(10%+4rem)] md:hover:w-[calc(100%+64rem)]"
        v-for="likedEntertainment in data"
        :key="likedEntertainment._id"
      >
        <router-link
          :to="`/details/${likedEntertainment.entertainment.type}/${likedEntertainment.entertainment.id}`"
          class="h-full w-full rounded shadow-2xl z-0 bg-cover bg-center group overflow-hidden cursor-pointer block relative"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/w300_and_h450_bestv2/${likedEntertainment.entertainment.info.poster})`
          }"
        >
          <div
            class="w-full h-auto opacity-0 bottom-0 group-hover:opacity-100 text-white backdrop-blur p-2 transition-all absolute flex items-end select-none"
          >
            <div class="flex flex-col justify-center gap-1 p-2">
              <h1 class="font-semibold break-words line-clamp-1">
                {{ likedEntertainment.entertainment.info.title }}
              </h1>
              <div class="flex gap-1 items-center">
                <IconsStarFilled class="text-yellow-500 w-6 h-6" />
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
