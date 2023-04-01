<script setup lang="ts">
import { TMDBData } from "~~/src/@types"
const { $moment, $getTitle } = useNuxtApp()

const { data, isLight, loading } = defineProps<{
  data?: TMDBData
  isLight?: boolean
  loading?: boolean
}>()
const title = computed(() => {
  return data ? $getTitle(data) : "..."
})
const overview = computed(() => {
  return data && data.localData.info.description
})
const imdbScore = computed(() => {
  return (
    (data && data.localData.info.ratings?.imdb) ||
    (data && data.localData.info.ratings?.tmdb) ||
    (data && data.vote_average)
  )
})

const rottenTomatoesScore = computed(() => {
  return data && data.localData.info.ratings?.rotten_tomatoes
})

const contentRating = computed(() => {
  return data && data.localData.info.rated
})

const genres = computed(() => {
  return data && data.genres && data.genres.length > 0
    ? data.genres.map((genre) => genre.name).join(", ")
    : ""
})
const runtime = computed(() => {
  return $moment
    .duration(
      (data && data.runtime) ||
        (data && data.episode_run_time && data.episode_run_time[0]) ||
        45,
      "minutes"
    )
    .format("h[h] m[m]")
})
const releaseDate = computed(() => {
  return $moment(
    (data && data.release_date) || (data && data.first_air_date) || 0
  ).format("YYYY")
})

useHead({
  title,
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <div v-if="loading">
    <div>
      <div class="flex flex-col-reverse text-center lg:text-left">
        <h1
          class="skeleton-effect inline-block h-8 w-full flex-shrink-0 rounded bg-gray-300 font-semibold leading-8 dark:bg-zinc-800 lg:leading-none"
        ></h1>
        <!-- Mobile Extensions -->
        <div class="my-2 flex items-center justify-center gap-2 lg:hidden">
          <div
            class="skeleton-effect h-6 w-4/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect h-6 w-4/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect h-6 w-4/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800"
          ></div>
        </div>
        <!-- Desktop -->
        <div
          class="flex items-center justify-center gap-2 text-xs sm:text-sm lg:mb-2 lg:justify-start lg:text-lg"
        >
          <div
            class="skeleton-effect h-4 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect h-4 w-1/4 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect h-4 w-2/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect hidden h-6 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800 lg:block"
          ></div>
          <div
            class="skeleton-effect hidden h-6 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800 lg:block"
          ></div>
          <div
            class="skeleton-effect hidden h-6 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800 lg:block"
          ></div>
        </div>
      </div>
      <div class="mt-2.5 flex flex-col items-center gap-2 lg:items-start">
        <div
          class="skeleton-effect h-2 w-11/12 rounded bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div
          class="skeleton-effect h-2 w-10/12 rounded bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div
          class="skeleton-effect h-2 w-11/12 rounded bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div
          class="skeleton-effect h-2 w-9/12 rounded bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div
          class="skeleton-effect h-2 w-10/12 rounded bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div
          class="skeleton-effect h-2 w-6/12 rounded bg-gray-300 dark:bg-zinc-800"
        ></div>
      </div>
    </div>
  </div>
  <div v-else-if="data && !loading">
    <div class="flex flex-col-reverse text-center lg:text-left">
      <h1
        class="inline-block flex-shrink-0 font-semibold leading-8 lg:leading-none"
        :class="{
          'text-4xl md:text-5xl lg:text-6xl': title.length < 20,
          'text-3xl md:text-4xl lg:text-5xl': title.length < 30,
          'text-2xl md:text-3xl lg:text-4xl': title.length >= 30,
          'text-black': isLight,
          'text-white': !isLight
        }"
      >
        {{ title }}
      </h1>
      <!-- Mobile Extensions -->
      <div class="my-2 flex items-center justify-center gap-2 lg:hidden">
        <h2
          v-if="contentRating && contentRating !== 'Not Rated'"
          class="border px-2 text-lg font-semibold line-clamp-1"
          :class="{
            'border-black/40 text-black': isLight,
            'border-white/40 text-white/70': !isLight
          }"
        >
          {{ contentRating || "NR" }}
        </h2>
        <IMDBLink
          v-if="data?.imdb_id"
          :imdb="data?.imdb_id"
          :score="imdbScore"
        />
        <RottenTomatoes
          v-if="rottenTomatoesScore"
          :score="rottenTomatoesScore"
        />
      </div>
      <!-- Desktop -->
      <div
        class="flex items-center justify-center divide-x-2 text-xs sm:text-sm lg:justify-start lg:text-lg"
        :class="{
          'divide-black/20 text-black': isLight,
          'divide-white/20 text-white/70': !isLight
        }"
      >
        <h2 class="ml-0.5 pr-2 font-semibold">
          {{ releaseDate }}
        </h2>
        <h2 v-if="genres" class="break-all px-2 font-semibold line-clamp-1">
          {{ genres }}
        </h2>
        <h2 class="flex-shrink-0 px-2 font-semibold line-clamp-1">
          {{ runtime }}
        </h2>

        <div class="hidden flex-shrink-0 items-center gap-2 px-2 lg:flex">
          <h2
            v-if="contentRating && contentRating !== 'Not Rated'"
            class="border px-2 text-lg font-semibold line-clamp-1"
            :class="{
              'border-black/40': isLight,
              'border-white/40': !isLight
            }"
          >
            {{ contentRating || "NR" }}
          </h2>
          <IMDBLink
            v-if="data?.imdb_id"
            :imdb="data?.imdb_id"
            :score="imdbScore"
          />
          <RottenTomatoes
            v-if="rottenTomatoesScore"
            :score="rottenTomatoesScore"
          />
        </div>
      </div>
    </div>
    <p
      class="mt-2 text-center text-base line-clamp-6 lg:text-left lg:text-xl"
      :class="{
        'text-black/80': isLight,
        'text-white/80 ': !isLight
      }"
    >
      {{ overview }}
    </p>
  </div>
</template>