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
    <div class="flex justify-center items-center h-64">
      <Spinner color="#000" />
    </div>
  </div>
  <div v-else>
    <div class="flex justify-between items-center">
      <div v-if="$route.path !== '/table'">
        <router-link
          to="/table"
          class="text-2xl block font-bold my-4 md:border-l-4 pl-2 border-blue-700 hover:border-blue-500 transition-colors"
        >
          Masterscore Table
        </router-link>
      </div>
      <div v-else>{{ listType }}</div>
      <select
        class="h-12"
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
          class="hover:underline flex items-center gap-2 text-lg font-semibold"
          :to="`/details/${entertainment.type}/${entertainment.id}`"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${entertainment.info.poster}`"
            class="w-auto h-10 rounded-md shadow-md"
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
        <div class="flex items-center gap-2 justify-center">
          <IconsStarFilled class="w-4 h-4 text-yellow-400" />
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
