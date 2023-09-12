<script setup>
import { vIntersectionObserver } from "@vueuse/components"
const { $tfiltergenres, $listen } = useNuxtApp()
useHead({
  title: "Masterscore",
  titleTemplate: "%s"
})

const refreshing = ref(false)

const {
  data: home,
  pending,
  refresh
} = await useLazyFetch("/api/extra/home", {
  headers: generateHeaders()
})

const top_rated = computed(() => {
  return home.value.top_rated.map((item) => {
    return {
      id: item.entertainment.id,
      media_type: item.entertainment.type,
      title: item.entertainment.info.title,
      poster_path: item.entertainment.info.poster,
      backdrop_path: item.entertainment.info.backdrop,
      vote_average: item.average
    }
  })
})

const genres = reactive(
  $tfiltergenres(
    [
      "Comedy",
      "Crime",
      "Science Fiction",
      "Fantasy",
      "Drama",
      "Family",
      "Animation",
      "Adventure",
      "Action"
    ],
    "movie"
  ).map((e) => {
    return { data: [], pending: true, ...e }
  })
)

const onIntersectionObserver = async ([{ isIntersecting }], genre) => {
  if (isIntersecting && genre.pending && !refreshing.value) {
    const { data, pending } = await useLazyFetch("/api/discover/movie", {
      headers: generateHeaders(),
      params: {
        with_genres: genre.id
      }
    })
    genre.pending = false

    genre.data = data.value.results
    genre.pending = pending.value
  }
}

$listen("refresh:entertainment", () => {
  refreshing.value = true
  refresh()
  genres.forEach((genre) => {
    genre.pending = true
  })
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
})
</script>
<template>
  <section v-if="pending && !home">
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center gap-8"
    >
      <Loader />
    </div>
  </section>
  <section class="relative" v-else>
    <!-- <HomeFeaturedEntertainment :data="home.featured" /> -->
    <HomeMainSlider :data="home.trending" />
    <div class="mx-auto mb-24 space-y-12">
      <section class="relative z-10 -mt-20 space-y-8">
        <h1 class="px-[4vw] font-maven text-2xl font-bold">
          {{ $t("home.recommended") }}
        </h1>
        <EntertainmentSlider
          :data="home.recommendations"
          :fixed-media-type="'movie'"
          :item-size="'large'"
          :offset="'auto'"
        />
      </section>
      <section class="relative z-10 space-y-8">
        <div class="flex items-center gap-4 px-[4vw]">
          <h1 class="font-maven text-2xl font-bold">
            {{ $t("home.top_rated") }}
          </h1>
          <span class="font-maven text-2xl font-black text-yellow-500">m</span>
        </div>
        <EntertainmentSlider
          :data="top_rated"
          :fixed-media-type="'movie'"
          :item-size="'large'"
          :offset="'auto'"
          :show-ratings="true"
        />
      </section>
      <section
        class="relative z-10 space-y-8"
        v-for="genre in genres"
        :id="genre"
      >
        <h1 class="px-[4vw] font-maven text-2xl font-bold">
          {{ $t("genres." + genre.name) }}
        </h1>
        <EntertainmentSlider
          v-intersection-observer="(e) => onIntersectionObserver(e, genre)"
          :loading="genre.pending"
          :data="genre.data"
          :fixed-media-type="'movie'"
          :item-size="'large'"
          :offset="'auto'"
        />
      </section>
    </div>
    <!-- <div class="my-20 space-y-12 px-[4vw]">
      <HomeShowFeed />
      <HomeShowMasterTable />
    </div> -->
  </section>
</template>
