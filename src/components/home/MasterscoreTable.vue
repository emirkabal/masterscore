<script setup>
import IMDB from "~/components/IMDB.vue"
import RottenTomatoes from "~/components/RottenTomatoes.vue"
const headers = [
  { text: "Rank", value: "rank", sortable: true, width: 40 },
  {
    text: "Entertainment",
    value: "entertainment.info.title",
    sortable: true
  },
  {
    text: "Release Date",
    value: "entertainment.info.release_date",
    sortable: true,
    width: 120
  },
  {
    text: "Runtime",
    value: "entertainment.info.runtime",
    sortable: true,
    width: 80
  },
  { text: "Rating", value: "average", sortable: true, width: 80 },
  { text: "Other Ratings", value: "otherRatings", sortable: false, width: 1 }
]

const items = ref([])

const listType = ref("movie")
const pending = ref(true)
const fetch = async () => {
  pending.value = true
  const data = await $fetch("/api/reviews?limit=100&type=" + listType.value, {
    headers: generateHeaders()
  })
  items.value = data.map((e, i) => {
    return {
      rank: i + 1,
      ...e,
      rating: e.entertainment.info.ratings
    }
  })
  pending.value = false
}

onMounted(() => {
  fetch()
})

watch(listType, () => {
  fetch()
})
</script>

<template>
  <div v-if="pending">
    <div class="flex h-64 items-center justify-center">
      <Spinner color="#000" />
    </div>
  </div>
  <div class="container mx-auto my-12 px-24" v-else>
    <div class="flex items-center justify-between">
      <h1
        class="my-4 block border-blue-700 pl-2 text-2xl font-bold md:border-l-4"
      >
        Masterscore Table
      </h1>
      <select
        class="h-12 rounded-lg dark:border-zinc-800 dark:bg-zinc-900"
        :value="listType"
        @input="(e) => (listType = e.target.value)"
      >
        <option value="">All</option>
        <option value="movie">Movies</option>
        <option value="tv">TV Shows</option>
      </select>
    </div>

    <EasyDataTable
      :headers="headers"
      :items="items"
      :loading="pending"
      :rows-items="[5, 10, 25, 50]"
      body-row-class-name="text-center"
      body-item-class-name="text-center"
      buttons-pagination
    >
      <template #item-rank="{ rank }">
        <span class="w-full text-center text-lg">#{{ rank }}</span>
      </template>
      <template #item-entertainment.info.title="{ entertainment }">
        <router-link
          class="flex items-center gap-2 text-lg font-semibold hover:underline"
          :to="`/details/${entertainment.type}/${entertainment.id}`"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${entertainment.info.poster}`"
            class="h-10 w-auto rounded-md shadow-md"
          />
          {{ entertainment.info.title }}
        </router-link>
      </template>
      <template #item-entertainment.info.release_date="item">
        {{ $moment(item.entertainment.info.release_date).format("YYYY") }}
      </template>
      <template #item-entertainment.info.runtime="item">
        {{
          $moment
            .duration(item.entertainment.info.runtime, "minutes")
            .format("h[h] m[m]")
        }}
      </template>
      <template #item-average="{ average }">
        <div class="flex items-center justify-center gap-2">
          <IconsStarFilled class="h-4 w-4 text-yellow-400" />
          {{ average.toFixed(1) }}
        </div>
      </template>
      <template #item-otherRatings="{ rating }">
        <div class="flex justify-start gap-2 px-2">
          <component v-if="rating.imdb" :is="IMDB" :score="rating.imdb" />
          <component
            v-if="rating.rotten_tomatoes"
            :is="RottenTomatoes"
            :score="rating.rotten_tomatoes"
          />
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
