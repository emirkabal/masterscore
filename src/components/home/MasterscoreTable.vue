<script setup>
import { useLocalStorage } from "@vueuse/core"
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
  { text: "c", value: "reviewsCount", sortable: true, width: 80 },
  { text: "Rating", value: "average", sortable: true, width: 80 }
]

const items = ref([])

const listType = ref("movie")
const disableReviewRequirement = useLocalStorage("mastertable-filter-1", false)
const pending = ref(true)
const firstLoad = ref(true)
const fetch = async () => {
  items.value = []
  pending.value = true
  const queries = new URLSearchParams()
  queries.append("limit", 500)
  if (disableReviewRequirement.value)
    queries.append("disableReviewRequirement", disableReviewRequirement.value)
  if (listType.value !== "all") queries.append("type", listType.value)
  const data = await $fetch("/api/reviews?" + queries.toString(), {})
  items.value = data.map((e, i) => {
    return {
      rank: i + 1,
      ...e,
      rating: e.entertainment.info.ratings
    }
  })
  pending.value = false
  firstLoad.value = false
}

onMounted(() => {
  fetch()
})

watch([listType, disableReviewRequirement], () => {
  fetch()
})
</script>

<template>
  <div v-if="firstLoad">
    <div class="flex h-64 items-center justify-center">
      <Spinner color="#000" />
    </div>
  </div>
  <div class="container mx-auto my-12 px-4 md:px-24" v-else>
    <div class="flex items-center justify-between">
      <h1 class="block border-l-4 border-blue-700 pl-2 text-2xl font-bold tracking-wide">
        Masterscore Table
      </h1>

      <Select v-model="listType">
        <SelectTrigger class="max-w-[180px]">
          <SelectValue placeholder="Select a type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all"> All </SelectItem>
            <SelectItem value="movie"> Movies </SelectItem>
            <SelectItem value="tv"> Series </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div class="mb-4 flex items-center gap-2">
      <HeadlessSwitch
        id="disableReviewRequirement"
        v-model="disableReviewRequirement"
        :class="!disableReviewRequirement ? 'bg-blue-700' : 'bg-teal-700'"
        class="relative inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          :class="!disableReviewRequirement ? 'translate-x-3.5' : 'translate-x-0'"
          class="pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
        />
      </HeadlessSwitch>
      <label for="disableReviewRequirement" class="select-none opacity-80">
        Show only entertainments with at least 3 reviews
      </label>
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
        <NuxtLink
          class="flex items-center gap-2 text-lg font-semibold hover:underline"
          :to="`/${entertainment.type}/${entertainment.id}`"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${entertainment.info.poster}`"
            class="h-10 w-auto rounded-md shadow-md"
          />
          {{ entertainment.info.title }}
        </NuxtLink>
      </template>
      <template #item-entertainment.info.release_date="item">
        {{ $moment(item.entertainment.info.release_date).locale($i18n.locale).format("YYYY") }}
      </template>
      <template #item-entertainment.info.runtime="item">
        {{
          $moment
            .duration(item.entertainment.info.runtime, "minutes")
            .locale($i18n.locale)
            .format("h[h] m[m]")
        }}
      </template>
      <template #item-average="{ average }">
        <div class="flex items-center justify-center gap-2">
          <ScoreCircle class="text-sm" :score="average" />
          <EntertainmentMRanking :rating="average.toFixed(1)" />
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
