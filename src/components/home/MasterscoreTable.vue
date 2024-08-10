<script setup>
import { useLocalStorage } from "@vueuse/core"
const headers = [
  { text: "Rank", value: "rank", sortable: true, width: 40 },
  {
    text: "Entertainment",
    value: "media.title",
    sortable: true
  },
  {
    text: "Release Date",
    value: "media.release_date",
    sortable: true,
    width: 120
  },
  {
    text: "Runtime",
    value: "media.runtime",
    sortable: true,
    width: 80
  },
  { text: "Reviewers", value: "count", sortable: true, width: 80 },
  { text: "Rating", value: "score", sortable: true, width: 80 }
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
      ...e
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
    <div class="flex h-screen items-center justify-center">
      <Spinner color="#000" />
    </div>
  </div>
  <div class="container mx-auto min-h-screen px-4 md:px-24" v-else>
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
      <template #item-media.title="{ media }">
        <NuxtLink
          class="flex items-center gap-2 text-lg font-semibold hover:underline"
          :to="`/${media.type}/${media.tmdb_id}`"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${media.images.poster}`"
            class="h-10 w-auto rounded-md shadow-md"
          />
          {{ media.title }}
        </NuxtLink>
      </template>
      <template #item-media.release_date="{ media }">
        {{ $moment(media.release_date).locale($i18n.locale).format("YYYY") }}
      </template>
      <template #item-media.runtime="{ media }">
        {{
          $humanize(media.runtime * 60_000, {
            language: $i18n.locale,
            delimiter: " ",
            units: ["m"],
            maxDecimalPoints: 0,
            fallbacks: ["en"]
          })
        }}
      </template>
      <template #item-count="{ count }">
        <div
          class="mx-auto flex h-6 w-fit items-center justify-center rounded-full bg-gray-800 px-4 text-gray-300"
        >
          <Icon name="ic:round-supervisor-account" class="h-4 w-4" />
          {{ count }}
        </div>
      </template>
      <template #item-score="{ score }">
        <div class="flex items-center justify-center gap-2 whitespace-nowrap">
          <ScoreCircle class="text-sm" :score="score" />
          <EntertainmentMRanking :rating="score.toFixed(1)" />
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
