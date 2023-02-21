<script setup>
const headers = [
  { text: "# Rank", value: "rank", sortable: true },
  { text: "Entertainment", value: "entertainment.info.title", sortable: true },
  {
    text: "Release Date",
    value: "entertainment.info.release_date",
    sortable: true
  },
  { text: "Runtime", value: "entertainment.info.runtime", sortable: true },
  { text: "MasterRating", value: "average", sortable: true },
  { text: "Other Ratings", value: "otherRatings", sortable: false }
]

const items = ref([])

const { data, pending } = useLazyFetch("/api/reviews?limit=100", {
  headers: generateHeaders()
})

watchEffect(() => {
  if (pending.value === false) {
    items.value = data.value.map((e, i) => {
      return {
        rank: i + 1,
        ...e
      }
    })
  }
})
</script>

<template>
  <div>
    <EasyDataTable
      :headers="headers"
      :items="items"
      :loading="loading"
      :rows-items="[5, 10, 25, 50]"
      buttons-pagination
    >
      <template #item-rank="{ rank }"> #{{ rank }} </template>
      <template #item-entertainment.info.title="{ entertainment }">
        <router-link
          class="hover:underline flex items-center gap-2"
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
        <div class="flex items-center gap-2">
          <IconsStarFilled class="w-4 h-4 text-yellow-400" />
          {{ average.toFixed(1) }}
        </div>
      </template>
      <template #item-otherRatings="item">
        <div class="flex justify-start gap-2">
          <IMDB
            v-if="item.entertainment.info.ratings?.imdb"
            :score="item.entertainment.info.ratings?.imdb || 0"
          ></IMDB>
          <RottenTomatoes
            v-if="item.entertainment.info.ratings?.rotten_tomatoes"
            :score="item.entertainment.info.ratings?.rotten_tomatoes || 0"
          ></RottenTomatoes>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
