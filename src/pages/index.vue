<script setup>
import { vIntersectionObserver } from "@vueuse/components"
import { getHome } from "~/composables/request"
const { $tfiltergenres, $listen } = useNuxtApp()

useHead({
  title: "Masterscore",
  titleTemplate: "%s"
})

const refreshing = ref(false)

const { data: home, status } = await useAsyncData(() => getHome(), {
  lazy: true
})

const top_rated = computed(() => {
  return home.value.top_rated.map((item) => {
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
  <div class="preffered-background">
    <div class="mx-auto max-w-[1600px] px-4 py-24">
      <div v-if="status === 'success'">
        <div class="h-[640px] w-full">
          <HomeMainSlider :data="home.trending" />
        </div>

        <div class="space-y-4 py-12">
          <div class="mb-6 flex h-10 items-center justify-between gap-x-4">
            <h3 class="text-4xl font-bold tracking-tight">En çok puan alanlar</h3>
            <NuxtLink to="/table" class="text-sm font-semibold text-gray-300 hover:text-white">
              {{ $t("home.view_all") }}
            </NuxtLink>
          </div>
          <EntertainmentSlider
            :data="top_rated"
            :fixed-media-type="'movie'"
            :item-size="'default'"
            :offset="0"
            :show-ratings="true"
          />
        </div>

        <div class="mt-8 flex gap-6">
          <div class="h-full w-full">
            <h3 class="text-3xl font-bold tracking-tight">Yakın zamanda ilgi çekenler</h3>
            <div class="mt-6 grid gap-6">
              <HomeCard
                v-for="hero in home.trending.slice(6, 17)"
                :key="hero.id"
                :to="`${hero.media_type}/${hero.id}`"
                :poster="hero.poster_path"
                :title="$getTitle(hero)"
                :subtitle="$getYear(hero).toString()"
              />
            </div>
          </div>
          <div class="flex w-full flex-col gap-12">
            <div class="h-full w-full">
              <h3 class="text-3xl font-bold tracking-tight">En çok beğenilenler</h3>
              <div class="mt-6 grid grid-cols-2 gap-6">
                <HomeCard
                  v-for="hero in home.top_liked"
                  :key="hero.id"
                  :to="`${hero.media.type}/${hero.media.tmdb_id}`"
                  :poster="hero.media.images.poster"
                  :title="hero.media.title"
                  :subtitle="`${hero.count} beğeni`"
                />
              </div>
            </div>
            <div class="h-full w-full">
              <h3 class="text-3xl font-bold tracking-tight">En çok yorum toplayanlar</h3>
              <div class="mt-6 grid grid-cols-2 gap-6">
                <HomeCard
                  v-for="hero in home.top_commented"
                  :key="hero.media.id"
                  :to="`${hero.media.type}/${hero.media.tmdb_id}`"
                  :poster="hero.media.images.poster"
                  :title="$getTitle(hero.media)"
                  :subtitle="`${hero.count} yorum`"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative my-24 flex items-center justify-between overflow-hidden rounded-3xl bg-fuchsia-500 bg-gradient-to-r from-fuchsia-800 from-25% px-16 py-24"
        >
          <div class="space-y-4">
            <h3 class="text-3xl font-semibold">Bir birinden farklı içeriklere göz at</h3>
            <NuxtLink
              to="/discover"
              class="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 text-lg font-semibold text-black transition-opacity hover:opacity-75"
            >
              <Icon name="ic:round-explore" size="24" />
              {{ $t("discover.title") }}
            </NuxtLink>
          </div>
          <div class="absolute -right-32 top-6 select-none">
            <div class="flex max-w-5xl flex-wrap gap-4">
              <MasterImage
                class="aspect-poster h-48 rounded-3xl"
                v-for="hero in home.trending"
                :key="hero.id"
                :source="$timage(hero.poster_path, 'w154')"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 flex gap-6">
          <div class="h-96 w-full rounded-3xl bg-gray-700"></div>
          <div class="h-96 w-full rounded-3xl bg-gray-700"></div>
        </div>
        <div class="mt-8 flex gap-6">
          <div class="h-96 w-full rounded-3xl bg-gray-700"></div>
          <div class="h-96 w-full rounded-3xl bg-gray-700"></div>
        </div>
      </div>
      <div v-else>
        <div class="skeleton-effect h-[640px] w-full rounded-3xl bg-gray-900"></div>

        <div class="mt-8 flex gap-6">
          <div class="skeleton-effect h-96 w-full rounded-3xl bg-gray-900"></div>
          <div class="skeleton-effect h-96 w-full rounded-3xl bg-gray-900"></div>
        </div>

        <div class="mt-8 flex gap-6">
          <div class="skeleton-effect h-96 w-full rounded-3xl bg-gray-900"></div>
          <div class="skeleton-effect h-96 w-full rounded-3xl bg-gray-900"></div>
        </div>
      </div>
    </div>
  </div>
</template>
