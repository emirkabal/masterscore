<script lang="ts" setup>
import { UseImage } from "@vueuse/components"
import type { TMDBData, TMDBSearchResult } from "~/types"
const { $humanize } = useNuxtApp()
const { locale } = useI18n()

const props = defineProps<{ meta: TMDBSearchResult }>()
const mediaType = props.meta.title ? "movie" : "tv"

const data = reactive({
  details: {} as TMDBData,
  pending: true
})

const logoPath = computed(() => {
  return data.details?.images?.logos?.length && data.details?.images?.logos[0].file_path
})

const runtime = computed(() => {
  const ms =
    ((data && data.details?.runtime) ||
      (data && data.details?.episode_run_time && data.details?.episode_run_time[0]) ||
      120) *
    60 *
    1000
  return $humanize(ms, {
    language: locale.value,
    delimiter: " ",
    units: ["m"],
    // dakika -> dak
    // minutes -> min

    maxDecimalPoints: 0,
    fallbacks: ["en"]
  })
})

const fetch = async () => {
  data.details = {} as TMDBData
  data.pending = true
  const res = await $fetch(`/api/tmdb/${props.meta.id}?type=${mediaType}`)
  if ("id" in res) data.details = res
  data.pending = false
}

fetch()
watch(props, fetch)
</script>

<template>
  <div
    class="relative z-0 hidden w-[29rem] flex-shrink-0 overflow-hidden rounded-bl-2xl rounded-tl-2xl p-6 lg:block"
    :style="{
      backgroundColor: '#0f0d20'
    }"
  >
    <PagesDiscoverDetailsLoadingIndicator v-if="data.pending" />
    <div class="absolute -bottom-10 -left-10 -right-10 -top-10 -z-[1]">
      <img
        :src="$timage(meta?.backdrop_path || '', 'w1280')"
        :draggable="false"
        class="block h-full w-full object-cover object-center opacity-30 blur"
      />
    </div>
    <ScrollArea class="h-[calc(100%-96px)] px-4 font-maven">
      <div class="my-8 flex h-24 items-center justify-center text-2xl font-black">
        <UseImage
          v-if="logoPath"
          :src="$timage(logoPath, 'w300')"
          class="mx-auto max-h-24 w-auto object-cover object-top text-center"
        >
          <template v-slot:error v-slot:loading>
            <h3>{{ $getTitle(meta) }}</h3>
          </template>
        </UseImage>
        <h3 v-else>{{ $getTitle(meta) }}</h3>
      </div>

      <div class="mb-12 flex justify-between whitespace-nowrap text-2xl font-medium">
        <span>
          {{ runtime }}
        </span>
        <span>
          {{ $getYear(meta) }}
        </span>
        <div v-if="meta.vote_average" class="flex items-center gap-x-2">
          <span>
            {{ meta.vote_average.toFixed(1) }}
          </span>
          <div class="h-5 w-10 rounded bg-yellow-400">
            <IconsImdb class="fill-black" />
          </div>
        </div>
      </div>

      <p class="text-base leading-7 tracking-tight text-gray-200">
        {{ meta.overview }}
      </p>
    </ScrollArea>

    <PagesDiscoverDetailsButtonGroup :id="data.details.localId" />
  </div>
</template>
