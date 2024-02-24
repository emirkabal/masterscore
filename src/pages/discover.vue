<script setup lang="ts">
import type { TMDBSearchResult } from "~/types"
import { vInfiniteScroll } from "@vueuse/components"

const { t } = useI18n()
const { $tfiltergenres } = useNuxtApp()

const router = useRouter()
const route = useRoute()

const content = ref<TMDBSearchResult[]>([])
const select = ref<number>(0)
const selected = computed(() => content.value[select.value])

const config = reactive({
  type: "movie",
  genres: [] as number[],
  page: 1,
  finish: false,
  pending: true,
  freeze: false
})

const type = ref((route.query.type && route.query.type.toString()) || "movie")
const genres = ref<{ value: number; label: string }[]>(
  $tfiltergenres([], "movie").map((i) => ({ value: i.id, label: i.name }))
)
const selectedGenres = ref<number[]>(
  (route.query?.genres &&
    route.query?.genres
      .toString()
      .split(",")
      .map((e) => parseInt(e))) ||
    []
)

watch(
  type,
  () => {
    if (type.value === config.type) return
    selectedGenres.value = []
    if (type.value === "movie") {
      genres.value = $tfiltergenres([], "movie").map((i) => ({ value: i.id, label: i.name }))
    } else {
      genres.value = $tfiltergenres([], "tv").map((i) => ({ value: i.id, label: i.name }))
    }
  },
  {
    immediate: true
  }
)

const isDisabled = computed(() => {
  return config.genres.join("") === selectedGenres.value.join("") && config.type === type.value
})

const changeSelect = (index: number) => {
  if (select.value === index && selected.value)
    return router.push(`/details/${config.type}/${selected.value.id}`)
  select.value = index
}

const search = async () => {
  if (config.genres.join("") !== selectedGenres.value.join("") || config.type !== type.value) {
    config.page = 1
    content.value = []
  }

  config.genres = [...selectedGenres.value]
  config.type = type.value

  router.replace({
    query: {
      ...(selectedGenres.value.length && { genres: selectedGenres.value.join(",") }),
      ...(type.value !== "movie" && { type: type.value })
    }
  })

  config.pending = true

  const data = await $fetch(`/api/discover/${config.type}`, {
    params: {
      with_genres: config.genres.join(","),
      page: config.page
    }
  })

  content.value = [...content.value, ...data.results]
  if (config.page === 1) changeSelect(0)

  config.pending = false
  config.page++
  if (data.page >= data.total_pages) config.finish = true
  if (config.page === 2) search()
}

const reset = () => {
  config.page = 1
  content.value = []
  selectedGenres.value = []
  config.finish = false
}

search()

const onLoadMore = async () => {
  if (config.freeze || config.pending || config.finish) return
  config.freeze = true
  setTimeout(() => {
    config.freeze = false
  }, 500)
  search()
}

useHead({
  title: t("discover.title"),
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <main
    class="h-screen select-none bg-gradient-to-tr from-gray-950 via-gray-950 via-25% to-[#232054]"
  >
    <section class="flex h-full w-full pt-24">
      <div class="h-full w-full px-6">
        <div class="flex w-full gap-x-4 pr-8">
          <Select v-model="type">
            <SelectTrigger class="max-w-[180px]">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="movie"> Movies </SelectItem>
                <SelectItem value="tv"> Series </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <PagesDiscoverGenresInput :genres="genres" v-model="selectedGenres" />

          <button
            @click="search"
            :disabled="isDisabled"
            class="flex h-10 flex-shrink-0 items-center gap-x-2 rounded-full bg-popover px-4 font-medium text-gray-300 transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="ic:round-tune" class="h-6 w-6" />
            <span> Apply filters </span>
          </button>
        </div>
        <div v-if="!config.pending && config.finish && !content.length">
          <p class="mt-4 text-center text-gray-300">Content not available.</p>

          <button
            @click="reset"
            class="mx-auto mt-4 flex h-10 flex-shrink-0 items-center gap-x-2 rounded-full bg-popover px-4 font-medium text-gray-300 transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="ic:round-tune" class="h-6 w-6" />
            <span> Reset filters </span>
          </button>
        </div>
        <ScrollArea class="h-[calc(100%-56px)] w-full pr-4 pt-4">
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-9">
            <div v-if="config.pending && !content.length" v-for="i in 40" class="p-4">
              <div class="skeleton-effect aspect-poster w-full rounded-lg bg-gray-900/50"></div>
              <div class="skeleton-effect mx-auto mt-2 h-4 w-3/4 rounded-full bg-gray-900/50"></div>
            </div>
            <PagesDiscoverCard
              v-for="(card, i) in content"
              :meta="card"
              :selected="i === select"
              @click="changeSelect(i)"
            />
            <div class="h-1 w-1" v-infinite-scroll="onLoadMore"></div>

            <div v-infinite-scroll="onLoadMore"></div>
          </div>
        </ScrollArea>
      </div>
      <div
        v-if="config.pending && !selected"
        class="skeleton-effect hidden w-[29rem] flex-shrink-0 rounded-bl-3xl rounded-tl-3xl bg-gray-900/50 lg:block"
      ></div>
      <PagesDiscoverDetails v-else-if="selected" :meta="selected" />
    </section>
  </main>
</template>

<style scoped>
::-webkit-scrollbar {
  @apply h-2 w-2 bg-transparent;
}

::-webkit-scrollbar-track {
  @apply rounded-full bg-gray-400;
}

::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-800 transition-colors hover:bg-gray-700;
}
</style>
