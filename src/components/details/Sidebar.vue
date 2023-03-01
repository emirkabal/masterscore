<script setup lang="ts">
import { TMDBMovie, TMDBTV } from "~~/src/@types"

const props = defineProps<{
  data: TMDBMovie | TMDBTV
}>()

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol"
})

const { data, pending } = useLazyFetch(
  `/api/extra/videos/${props.data.id}?type=${props.data.localData?.type}`,
  {
    headers: generateHeaders()
  }
) as {
  data: Ref<Record<string, any>>
  pending: Ref<boolean>
}

const status = computed(() => {
  return props.data.status || "Unknown"
})

const website = computed(() => {
  return props.data.homepage
})

const language = computed(() => {
  return (
    props.data.spoken_languages?.find(
      (e) => e.iso_639_1 === props.data.original_language
    )?.english_name || "Unknown"
  )
})

const spokenLanguages = computed(() => {
  return (
    props.data.spoken_languages?.map((e) => e.english_name).join(", ") ||
    "Unknown"
  )
})

const budget = computed(() => {
  return "budget" in props.data && props.data.revenue !== 0
    ? formatter.format(Number(props.data.budget))
    : "-"
})

const revenue = computed(() => {
  return "revenue" in props.data && props.data.revenue !== 0
    ? formatter.format(Number(props.data.revenue))
    : "-"
})

const getVideo = computed(() => {
  if (data.value) {
    const offical = data.value.results.find(
      (e: any) => e.official && e.type === "Trailer" && e.site === "YouTube"
    )
    if (offical) {
      return `https://youtu.be/${offical.key}`
    }
    const trailer = data.value.results.find(
      (e: any) => e.type === "Trailer" && e.site === "YouTube"
    )
    if (trailer) {
      return `https://youtu.be/${trailer.key}`
    }
    const teaser = data.value.results.find(
      (e: any) => e.type === "Teaser" && e.site === "YouTube"
    )
    if (teaser) {
      return `https://youtu.be/${teaser.key}`
    }

    return null
  }
})
</script>

<template>
  <div class="w-full rounded-3xl p-6">
    <div class="space-y-8">
      <div class="space-y-2">
        <div
          v-if="pending"
          class="flex w-full items-center justify-center rounded bg-gray-50 px-4 py-2 dark:bg-zinc-900"
        >
          Loading...
        </div>
        <a
          v-else-if="getVideo"
          class="flex w-full items-center justify-center gap-2 rounded bg-gray-50 px-4 py-2 transition-opacity hover:opacity-90 dark:bg-zinc-900"
          :href="getVideo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconsPlay class="h-6 w-6 text-blue-600" />
          <span>Watch Trailer</span>
        </a>
      </div>

      <p>
        <strong>Status</strong>
        <span>{{ status }}</span>
      </p>
      <p>
        <strong>Language</strong>
        <span>{{ language }}</span>
      </p>
      <p>
        <strong
          >Spoken Language{{
            spokenLanguages.indexOf(",") !== -1 ? "s" : ""
          }}</strong
        >
        <span class="break-all">{{ spokenLanguages }}</span>
      </p>
      <p>
        <strong>Budget</strong>
        <span
          :class="{
            'font-semibold text-blue-800': budget !== '-'
          }"
          >{{ budget }}</span
        >
      </p>
      <p>
        <strong>Revenue</strong>
        <span
          :class="{
            'font-semibold text-green-800': revenue !== '-'
          }"
          >{{ revenue }}</span
        >
      </p>
      <a
        :href="website"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <IconsLink class="h-6 w-6" />
        <span>Visit website</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
p strong {
  @apply block font-semibold;
}
p {
  @apply block font-maven;
}
</style>
