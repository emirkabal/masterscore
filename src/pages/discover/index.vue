<script setup lang="ts">
import { Genre, TMDBSearchResult } from "~/@types"

const { $tgenres } = useNuxtApp()
const { t } = useI18n()
const banned: Genre[] = [
  "Soap",
  "Talk",
  "News",
  "Reality",
  "TV Movie",
  "Music",
  "Sci-Fi & Fantasy",
  "Action & Adventure",
  "War & Politics",
  "Kids",
  "History",
  "War"
]

const genres = ref<
  {
    id: number
    name: string
    support: string[]
    image?: string
  }[]
>($tgenres.filter((e) => !banned.includes(e.name as Genre)))
const results = ref<TMDBSearchResult[]>([])

const getRandomColor = () => {
  const red = Math.floor(Math.random() * 256)
  const green = 10
  const blue = Math.floor(Math.random() * 256)
  const alpha = 0.4

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

onMounted(async () => {
  const data = await $fetch(`/api/discover/movie`, {
    headers: generateHeaders(),
    params: {
      with_genres: $tgenres
        .filter(
          (e) =>
            e.support.includes("movie") && !banned.includes(e.name as Genre)
        )
        .map((e) => e.id)
        .join("|")
    }
  })

  results.value.push(...data.results)

  results.value.forEach((e) => {
    const genre = genres.value.find((genre) => e?.genre_ids?.includes(genre.id))
    if (genre && !genre.image) {
      genre.image = e.poster_path
    }
  })

  genres.value
    .filter((e) => !e.image)
    .forEach((e) => {
      const notUsed = results.value.filter(
        (result) =>
          !genres.value.find((genre) => genre.image === result.poster_path)
      )
      const random = notUsed[Math.floor(Math.random() * notUsed.length)]

      e.image = random.poster_path
    })
})

useHead({
  title: t("discover.title"),
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <section class="mb-12 mt-32 px-[4vw]">
    <h1 class="my-8 text-center text-4xl font-bold md:text-start md:text-5xl">
      {{ $t("discover.title") }}
    </h1>
    <div
      class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <NuxtLink
        :to="`/discover/${genre.support[0]}/${genre.id}`"
        v-for="genre in genres"
        class="group relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl p-12 text-center text-4xl font-semibold"
        :style="{
          background: `linear-gradient(
            rgba(0, 0, 0, .2) 0%,
            ${getRandomColor()} 100%
          )`
        }"
      >
        <MasterImage
          v-if="genre.image"
          :source="$timage(genre.image || '-', 'w500')"
          :alt="genre.name"
          class="absolute inset-0 -z-10 h-full w-full object-cover transition-all duration-500 group-hover:scale-150 group-hover:blur-sm"
        />
        <p
          class="relative z-10 text-2xl font-bold text-white transition-transform group-hover:scale-125 hover:opacity-75 md:text-4xl"
        >
          {{ $t("genres." + genre.name) }}
        </p>
      </NuxtLink>
    </div>
  </section>
</template>
