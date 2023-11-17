<script setup lang="ts">
import type { TMDBData } from "~/types"
const { $moment, $getTitle } = useNuxtApp()
const { locale } = useI18n()

const { data, isLight, loading } = defineProps<{
  data?: TMDBData
  isLight?: boolean
  loading?: boolean
  rating?: number
  reviewData?: any
}>()
const title = computed(() => {
  return data ? $getTitle(data) : "..."
})
const overview = computed(() => {
  return data && data.overview
})

const contentRating = computed(() => {
  return data && data.localData.info.rated
})

const genres = computed(() => {
  return data && data.genres
})
const runtime = computed(() => {
  return $moment
    .duration(
      (data && data.runtime) || (data && data.episode_run_time && data.episode_run_time[0]) || 45,
      "minutes"
    )
    .locale(locale.value)
    .humanize()
})
const releaseDate = computed(() => {
  return $moment((data && data.release_date) || (data && data.first_air_date) || 0)
    .locale(locale.value)
    .format("YYYY")
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
          class="skeleton-effect inline-block h-10 w-full flex-shrink-0 rounded bg-gray-300 font-semibold leading-8 dark:bg-gray-800 lg:leading-none"
        ></h1>
        <!-- Mobile Extensions -->
        <div class="my-2 flex items-center justify-center gap-2 lg:hidden">
          <div
            class="skeleton-effect h-6 w-4/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800"
          ></div>
          <div
            class="skeleton-effect h-6 w-4/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800"
          ></div>
        </div>
        <!-- Desktop -->
        <div
          class="flex items-center justify-center gap-2 text-xs sm:text-sm lg:mb-2 lg:justify-start lg:text-lg"
        >
          <div
            class="skeleton-effect h-4 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800"
          ></div>
          <div
            class="skeleton-effect h-4 w-1/4 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800"
          ></div>
          <div
            class="skeleton-effect h-4 w-2/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800"
          ></div>
          <div
            class="skeleton-effect hidden h-6 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800 lg:block"
          ></div>
          <div
            class="skeleton-effect hidden h-6 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800 lg:block"
          ></div>
          <div
            class="skeleton-effect hidden h-6 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800 lg:block"
          ></div>
        </div>
      </div>
      <div class="mt-2.5 flex flex-col items-center gap-2 lg:items-start">
        <div class="skeleton-effect h-4 w-11/12 rounded bg-gray-300 dark:bg-gray-800"></div>
        <div class="skeleton-effect h-4 w-10/12 rounded bg-gray-300 dark:bg-gray-800"></div>
        <div class="skeleton-effect h-4 w-6/12 rounded bg-gray-300 dark:bg-gray-800"></div>
      </div>
    </div>
  </div>
  <div v-else-if="data && !loading">
    <div class="flex flex-col-reverse text-center lg:text-left">
      <h1
        class="inline-block flex-shrink-0 font-semibold tracking-tight text-white"
        :class="{
          'text-4xl md:text-5xl lg:text-6xl': title.length < 20,
          'text-3xl md:text-4xl lg:text-5xl': title.length < 30,
          'text-2xl md:text-3xl lg:text-4xl': title.length >= 30
        }"
      >
        {{ title }}
      </h1>
      <!-- Desktop -->

      <div
        class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-start"
        :class="{
          'text-black': isLight,
          'text-white/70': !isLight
        }"
      >
        <ScoreCircle :score="rating" />
        <EntertainmentMRanking :rating="rating" />
      </div>
    </div>
    <div
      class="my-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/80 lg:justify-start"
    >
      <h2
        v-if="contentRating && contentRating !== 'Not Rated'"
        class="line-clamp-1 border px-2 font-semibold"
        :class="{
          'border-black/40': isLight,
          'border-white/40': !isLight
        }"
      >
        {{ contentRating || "NR" }}
      </h2>
      <h2 class="font-semibold md:ml-0.5">
        {{ releaseDate }}
      </h2>

      <NuxtLink
        v-for="genre in genres"
        :to="`/discover/${$route.params.type}/${genre.id}`"
        class="font-semibold transition-colors hover:text-white"
      >
        {{ genre.name }}
      </NuxtLink>

      <h2 class="line-clamp-1 flex-shrink-0 font-semibold">
        {{ runtime }}
      </h2>
    </div>
    <p class="mt-2 line-clamp-6 text-center text-base text-white/80 lg:text-left lg:text-xl">
      {{ overview }}
    </p>
  </div>
</template>
