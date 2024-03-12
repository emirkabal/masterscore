<script setup>
import { vIntersectionObserver } from "@vueuse/components"
import { useHomeStore } from "~/store/home"
const { $tfiltergenres, $listen } = useNuxtApp()
const homeStore = useHomeStore()

useHead({
  title: "Masterscore",
  titleTemplate: "%s"
})

const refreshing = ref(false)
const newContent = ref(false)

const {
  data: home,
  pending,
  refresh
} = await useAsyncData(
  "home",
  () => {
    return $fetch("/api/extra/home")
  },
  {
    lazy: true,
    server: false
  }
)

const top_rated = computed(() => {
  return homeStore.top_rated.map((item) => {
    return {
      id: item.media.tmdb_id,
      media_type: item.media.type,
      title: item.media.title,
      poster_path: item.media.images.poster,
      backdrop_path: item.media.images.backdrop,
      vote_average: item.score
    }
  })
})

const genres = useState("genres", () =>
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
      "Action",
      "Horror"
    ],
    "movie"
  ).map((e) => {
    return { data: [], pending: true, ...e }
  })
)

const onIntersectionObserver = async ([{ isIntersecting }], genre) => {
  if (isIntersecting && genre.pending && !refreshing.value) {
    const data = await getDiscover("movie", {
      with_genres: genre.id,
      page: Math.floor(Math.random() * 3) + 1
    })
    genre.pending = false
    genre.data = data.results
  }
}

watch(home, () => {
  if (!homeStore.isStored) homeStore.setData(home.value)
  else newContent.value = true
})

$listen("refresh:entertainment", () => {
  refreshing.value = true
  refresh()
  genres.value.forEach((genre) => {
    genre.pending = true
  })
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
})
</script>
<template>
  <div>
    <section v-if="pending || !home || !home.trending">
      <div class="mx-auto flex h-screen flex-col items-center justify-center gap-8">
        <Loader />
      </div>
    </section>
    <section v-else class="relative bg-gray-950">
      <HomeMainSlider :data="homeStore.trending" />
      <div class="relative mx-auto mb-24 space-y-12">
        <section v-if="homeStore.recommendations.length" class="relative z-10 -mt-20 space-y-8">
          <div class="flex h-10 items-center gap-x-4">
            <h1 class="pl-[4vw] text-2xl font-bold">
              {{ $t("home.recommended") }}
            </h1>
            <Loader v-if="pending" class="scale-50" />
            <button
              v-else-if="newContent"
              @click="
                () => {
                  newContent = false
                  homeStore.setData(home)
                }
              "
              class="h-10 bg-white px-4 font-semibold text-black transition-colors hover:bg-gray-200"
            >
              New content available
            </button>
          </div>
          <EntertainmentSlider
            :data="homeStore.recommendations"
            :fixed-media-type="'movie'"
            :item-size="'large'"
            :offset="'auto'"
          />
        </section>
        <section
          class="relative z-10 space-y-8"
          :class="{
            '-mt-20': !homeStore.recommendations.length
          }"
        >
          <div class="flex items-center gap-4 px-[4vw]">
            <h1 class="text-2xl font-bold">
              {{ $t("home.top_rated") }}
            </h1>
            <span class="font-maven text-2xl font-black text-brand">m</span>
          </div>
          <EntertainmentSlider
            :data="top_rated"
            :fixed-media-type="'movie'"
            :item-size="'large'"
            :offset="'auto'"
            :show-ratings="true"
          />
        </section>
        <section class="relative z-10 space-y-8" v-for="genre in genres" :key="genre.id">
          <NuxtLink
            :to="`/discover?genres=${genre.id}`"
            class="flex w-fit items-center gap-x-4 pl-[4vw]"
          >
            <h3 class="text-2xl font-bold">
              {{ $t("genres." + genre.name) }}
            </h3>
            <Icon name="ic:round-chevron-right" class="mt-1 h-7 w-auto" />
          </NuxtLink>
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
    </section>
  </div>
</template>
