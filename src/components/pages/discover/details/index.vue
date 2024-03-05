<script lang="ts" setup>
import type { TMDBData, TMDBSearchResult } from "~/types"
import { UseImage } from "@vueuse/components"
const { $humanize, $tgenre } = useNuxtApp()
const { locale } = useI18n()

const props = defineProps<{ meta: TMDBSearchResult }>()
const mediaType = props.meta.title ? "movie" : "tv"

const data = reactive({
  details: {} as TMDBData,
  pending: true
})

const details = computed(() => {
  return {
    logo: data.details?.images?.logos?.length && data.details?.images?.logos[0].file_path,
    runtime: $humanize(
      ((data && data.details?.runtime) ||
        (data && data.details?.episode_run_time && data.details?.episode_run_time[0]) ||
        120) *
        60 *
        1000,
      {
        language: locale.value,
        delimiter: " ",
        units: ["m"],
        maxDecimalPoints: 0,
        fallbacks: ["en"]
      }
    ),
    score:
      data.details?.localData?.info?.ratings?.imdb ||
      (props.meta?.vote_average && props.meta.vote_average.toFixed(1)) ||
      "N/A",
    cast: data.details?.credits?.cast?.slice(0, 5),
    director: data.details?.credits?.crew?.find((i) => i.job === "Director"),
    createdBy: data.details?.created_by && data.details?.created_by[0],
    genres: props.meta.genre_ids || []
  }
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
    class="relative z-0 hidden w-[27rem] flex-shrink-0 overflow-hidden rounded-bl-xl rounded-tl-xl p-6 lg:block"
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
      <div class="mb-8 flex h-24 items-center justify-center text-center text-2xl font-black">
        <UseImage
          v-if="details.logo"
          :src="$timage(details.logo, 'w300')"
          :alt="$getTitle(meta)"
          class="mx-auto max-h-24 w-auto object-cover object-top text-center"
        >
          <template v-slot:error v-slot:loading>
            <h3>{{ $getTitle(meta) }}</h3>
          </template>
        </UseImage>
        <h3 v-else>{{ $getTitle(meta) }}</h3>
      </div>

      <div class="mb-8 flex justify-between whitespace-nowrap text-xl font-medium text-gray-200">
        <span>
          {{ details.runtime }}
        </span>
        <span>
          {{ $getYear(meta) }}
        </span>
        <div v-if="meta.vote_average" class="flex items-center gap-x-4">
          <span>
            {{ details.score }}
          </span>
          <IconsImdb class="h-6 w-10 fill-yellow-400" />
        </div>
      </div>

      <p class="mb-2 text-base leading-7 tracking-tight text-gray-200">
        {{ meta.overview }}
      </p>

      <div class="space-y-2">
        <PagesDiscoverDetailsTags
          :title="$t('discover.genres')"
          :tags="
            details.genres.map((i) => ({
              name: $t(`genres.${$tgenre(i)}`),
              url: `/discover?genres=${i}&type=${mediaType}`
            }))
          "
        />

        <PagesDiscoverDetailsTags
          v-if="details.cast?.length"
          :title="$t('discover.cast')"
          :tags="details.cast.map((i) => ({ name: i.name, url: `/person/${i.id}` }))"
        />

        <PagesDiscoverDetailsTags
          v-if="details.createdBy"
          :title="$t('jobs.creator')"
          :tags="[{ name: details.createdBy.name, url: `/person/${details.createdBy.id}` }]"
        />

        <PagesDiscoverDetailsTags
          v-if="details.director"
          :title="$t('jobs.director')"
          :tags="[{ name: details.director.name, url: `/person/${details.director.id}` }]"
        />
      </div>
    </ScrollArea>

    <PagesDiscoverDetailsButtonGroup :id="data.details.localId" />
  </div>
</template>
