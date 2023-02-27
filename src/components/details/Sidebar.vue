<script setup lang="ts">
import { TMDBMovie, TMDBTV } from "~~/src/@types"

const props = defineProps<{
  data: TMDBMovie | TMDBTV
}>()

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

const language = computed(() => {
  return (
    props.data.spoken_languages?.[0].english_name ||
    props.data.original_language ||
    "Unknown"
  )
})

const budget = computed(() => {
  return "budget" in props.data
    ? props.data.budget?.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      })
    : "-"
})

const revenue = computed(() => {
  return "revenue" in props.data
    ? props.data.revenue?.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      })
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
      <div
        v-if="pending"
        class="flex w-full items-center justify-center bg-gray-50 px-4 py-2 dark:bg-zinc-900"
      >
        Loading...
      </div>
      <a
        v-else-if="getVideo"
        class="flex w-full items-center justify-center gap-2 bg-gray-50 px-4 py-2 transition-opacity hover:opacity-90 dark:bg-zinc-900"
        :href="getVideo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconsPlay class="h-6 w-6 text-blue-600" />
        <span>Watch Trailer</span>
      </a>
      <p>
        <strong>Status</strong>
        <span>{{ status }}</span>
      </p>
      <p>
        <strong>Spoken Language</strong>
        <span>{{ language }}</span>
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
