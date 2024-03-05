<script setup lang="ts">
import type { TMDBData } from "~/types"
const { $moment, $humanize, $getTitle } = useNuxtApp()
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
  const ms =
    ((data && data.runtime) || (data && data.episode_run_time && data.episode_run_time[0]) || 45) *
    60 *
    1000
  return $humanize(ms, {
    language: locale.value,
    delimiter: " ",
    units: ["h", "m"],

    maxDecimalPoints: 0,
    fallbacks: ["en"]
  })
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
      <div class="flex flex-col items-center lg:items-start">
        <div
          class="skeleton-effect inline-block h-10 w-4/6 flex-shrink-0 rounded bg-gray-300 font-semibold leading-8 dark:bg-gray-800 lg:leading-none"
        ></div>
        <div
          class="mt-2 flex w-full items-center justify-center gap-2 text-xs sm:text-sm lg:justify-start lg:text-lg"
        >
          <div
            v-for="i in 4"
            class="skeleton-effect h-4 w-1/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-gray-800"
          ></div>
        </div>
      </div>
      <div class="my-4 hidden lg:block">
        <slot />
      </div>
      <div class="mt-2.5 flex flex-col items-start gap-2">
        <div class="skeleton-effect h-4 w-1/12 rounded bg-gray-300 dark:bg-gray-800"></div>
        <div class="skeleton-effect h-4 w-10/12 rounded bg-gray-300 dark:bg-gray-800"></div>
        <div class="skeleton-effect h-4 w-8/12 rounded bg-gray-300 dark:bg-gray-800"></div>
        <div class="skeleton-effect h-4 w-6/12 rounded bg-gray-300 dark:bg-gray-800"></div>
        <div class="skeleton-effect h-4 w-4/12 rounded bg-gray-300 dark:bg-gray-800"></div>
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="w-full space-y-2">
          <div class="skeleton-effect h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-800"></div>
          <div class="skeleton-effect h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-800"></div>
        </div>
        <div class="w-full space-y-2">
          <div class="skeleton-effect h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-800"></div>
          <div class="skeleton-effect h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-800"></div>
        </div>
        <div class="w-full space-y-2">
          <div class="skeleton-effect h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-800"></div>
          <div class="skeleton-effect h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-800"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="data && !loading">
    <div class="flex items-center justify-center gap-x-2 lg:justify-start">
      <ScoreCircle v-if="rating" :score="rating" />
      <EntertainmentMRanking :rating="rating" />
    </div>

    <h1
      class="my-2 text-center text-2xl font-semibold tracking-tight text-white lg:text-left lg:text-4xl"
    >
      {{ title }}
    </h1>

    <div
      class="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/80 lg:justify-start"
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
        :to="`/discover?genres=${genre.id}&type=${$route.params.type}`"
        class="font-semibold transition-colors hover:text-white"
      >
        {{ genre.name }}
      </NuxtLink>

      <h2 class="line-clamp-1 flex-shrink-0 font-semibold">
        {{ runtime }}
      </h2>
    </div>
    <div class="mb-4">
      <slot />
    </div>

    <section class="mt-2" v-if="overview?.length">
      <h2 class="font-semibold tracking-tight">{{ $t("profile.summary") }}</h2>
      <p class="line-clamp-4 text-base text-white/80">
        {{ overview }}
      </p>
    </section>
  </div>
</template>
