<script setup lang="ts">
import type { ProviderResults, TMDBData } from "~/types"
import ScreenModal from "~/components/ScreenModal.vue"
const { t, locale } = useI18n()
const { $getTitle, $moment } = useNuxtApp()
const { userAgent } = useDevice()
const props = defineProps<{
  data: TMDBData
  smartVideoData: any
}>()

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol"
})

const { data: providerData, pending: providerPending } =
  useLazyFetch<ProviderResults>(
    `https://watchhub.strem.io/stream/movie/${
      props.data.external_ids?.imdb_id || props.data.imdb_id
    }.json`
  )

const trailerModal = ref(false)

const getDateDiff = (date: string) => {
  return $moment(date).locale(locale.value).fromNow()
}

const status = computed(() => {
  if (props.data?.status === "Released" && props.data.release_date) {
    const releaseDate = $moment(props.data.release_date).locale(locale.value)
    return `${t("entertainment.sidebar.released")}: ${getDateDiff(
      props.data.release_date
    )}<br/>${releaseDate.format("MMMM D, YYYY")}`
  } else if (
    props.data?.status === "Ended" &&
    props.data.first_air_date &&
    props.data.last_air_date
  ) {
    const firstAirDate = $moment(props.data.first_air_date).locale(locale.value)
    const lastAirDate = $moment(props.data.last_air_date).locale(locale.value)
    return `${t("entertainment.sidebar.ended_at")}: ${lastAirDate.format(
      "MMMM D, YYYY"
    )}<br/>${firstAirDate.format("YYYY")}-${lastAirDate.format(
      "YYYY"
    )}<br/>${getDateDiff(props.data.last_air_date)}`
  } else if (
    props.data?.status === "Returning Series" &&
    props.data.first_air_date &&
    props.data.next_episode_to_air
  ) {
    const nextAirDate = $moment(props.data.next_episode_to_air.air_date).locale(
      locale.value
    )
    return `${t("entertainment.sidebar.returning_in")}: ${nextAirDate.format(
      "MMMM D, YYYY"
    )}`
  } else if (props.data?.status === "Planned") {
    return t("entertainment.sidebar.planned")
  }

  return props.data.status || t("unknown")
})

const website = computed(() => {
  return props.data.homepage
})

const language = computed(() => {
  return (
    props.data.spoken_languages?.find(
      (e) => e.iso_639_1 === props.data.original_language
    )?.name || t("unknown")
  )
})

const spokenLanguages = computed(() => {
  return (
    props.data.spoken_languages?.map((e) => e.name).join(", ") || t("unknown")
  )
})

const budget = computed(() => {
  return props.data.budget && props.data.revenue !== 0
    ? formatter.format(Number(props.data.budget))
    : "-"
})

const revenue = computed(() => {
  return props.data.revenue && props.data.revenue !== 0
    ? formatter.format(Number(props.data.revenue))
    : "-"
})

const originalName = computed(() => {
  if (
    "original_title" in props.data &&
    props.data.original_title !== $getTitle(props.data)
  ) {
    return props.data.original_title
  } else if (
    "original_name" in props.data &&
    props.data.original_name !== $getTitle(props.data)
  ) {
    return props.data.original_name
  } else {
    return null
  }
})

const localName = computed(() => {
  if (props.data.title && props.data.title !== $getTitle(props.data)) {
    return props.data.title
  } else if (props.data.name && props.data.name !== $getTitle(props.data)) {
    return props.data.name
  } else {
    return null
  }
})

const getCreator = computed(() => {
  if (props.data.created_by) {
    return props.data.created_by
  } else {
    return null
  }
})

const getVideo = computed(() => {
  if (props.data.videos?.results?.length > 0) {
    const offical = props.data.videos.results.find(
      (e: any) => e.official && e.type === "Trailer" && e.site === "YouTube"
    )
    if (offical) {
      return `https://youtu.be/${offical.key}`
    }
    const trailer = props.data.videos.results.find(
      (e: any) => e.type === "Trailer" && e.site === "YouTube"
    )
    if (trailer) {
      return `https://youtu.be/${trailer.key}`
    }
    const teaser = props.data.videos.results.find(
      (e: any) => e.type === "Teaser" && e.site === "YouTube"
    )
    if (teaser) {
      return `https://youtu.be/${teaser.key}`
    }

    return null
  }
})

const imdbScore = computed(() => {
  return (
    (props.data && props.data.localData.info.ratings?.imdb) ||
    (props.data && props.data.localData.info.ratings?.tmdb) ||
    (props.data && props.data.vote_average)
  )
})

const rtScore = computed(() => {
  return props.data && props.data.localData.info.ratings?.rotten_tomatoes
})
</script>

<template>
  <div class="z-20 w-full rounded-3xl p-0 lg:px-6 lg:pt-6">
    <ScreenModal
      v-if="getVideo"
      :modal="trailerModal"
      @close="trailerModal = false"
    >
      <iframe
        width="1920"
        height="1080"
        class="aspect-video h-auto max-h-[648px] w-full rounded-xl md:h-auto"
        :src="`https://www.youtube.com/embed/${
          getVideo.split('/')[3]
        }?autoplay=1`"
      />
    </ScreenModal>
    <div class="space-y-6">
      <button
        v-if="getVideo"
        class="flex w-full items-center justify-center gap-2 rounded bg-gray-50 px-4 py-2 transition-opacity hover:opacity-90 dark:bg-zinc-900"
        @click="trailerModal = true"
      >
        <Icon name="ic:outline-play-arrow" class="h-6 w-6 text-yellow-600" />
        <span>{{ $t("entertainment.watch_trailer") }}</span>
      </button>

      <div v-if="providerPending" class="space-y-2">
        <div
          class="skeleton-effect h-2 w-1/2 rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div class="flex items-center gap-2">
          <div
            class="skeleton-effect h-10 w-10 rounded-lg bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect h-10 w-10 rounded-lg bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect h-10 w-10 rounded-lg bg-gray-300 dark:bg-zinc-800"
          ></div>
        </div>
      </div>
      <div v-else-if="providerData?.streams?.length">
        <span class="font-bold">{{
          $t("entertainment.sidebar.availabe_on")
        }}</span>
        <div class="flex items-center gap-2">
          <span
            v-if="smartVideoData"
            v-tooltip="{
              content: `${$t('entertainment.sidebar.watch_on_masterscore', {
                platform: `<b>Masterscore</b>`
              })}`,
              html: true
            }"
            class="flex h-10 w-10 cursor-default items-center justify-center rounded-lg bg-gray-100 bg-cover bg-center bg-no-repeat font-maven text-3xl font-black text-yellow-500 transition-opacity hover:opacity-75 dark:bg-zinc-900"
          >
            <span class="-mt-1 select-none"> m </span>
          </span>
          <a
            v-for="provider in providerData.streams"
            :key="provider.name"
            :href="
              userAgent.includes('webOS')
                ? provider.androidTvUrl
                : provider.externalUrl
            "
            target="_blank"
            v-tooltip="{
              content: `<b>${provider.name}</b>, ${provider.title}`,
              html: true
            }"
            class="h-10 w-10 rounded-lg bg-cover bg-center bg-no-repeat transition-opacity hover:opacity-75"
            :style="{
              backgroundImage: `url(${
                $getProvider(provider.name)
                  ? `https://image.tmdb.org/t/p/original/${
                      $getProvider(provider.name)?.logo
                    }`
                  : 'https://i.imgur.com/qDIwea6.png'
              })`
            }"
          >
          </a>
        </div>
      </div>

      <EntertainmentCard
        class="w-full"
        v-if="data.belongs_to_collection"
        :title="$t('entertainment.sidebar.belongs_to_collection')"
        :entertainment="{
          id: '0',
          type: '0',
          info: {
            release_date: '0',
            title: data.belongs_to_collection.name
              .replace(' Collection', '')
              .replace('[Seri]', ''),
            poster: data.belongs_to_collection.poster_path,
            backdrop: data.belongs_to_collection.backdrop_path
          }
        }"
        :to="$route.path"
      />

      <p v-if="originalName">
        <strong>{{ $t("entertainment.sidebar.original_name") }}</strong>
        <span>{{ originalName }}</span>
      </p>
      <p>
        <strong>{{ $t("entertainment.sidebar.status") }}</strong>
        <span v-html="status"></span>
      </p>
      <p>
        <strong>{{ $t("entertainment.sidebar.language") }}</strong>
        <span>{{ language }}</span>
      </p>
      <p>
        <strong>{{ $t("entertainment.sidebar.spoken_languages") }}</strong>
        <span>{{ spokenLanguages }}</span>
      </p>
      <p v-if="localName">
        <strong>English Name</strong>
        <span>{{ localName }}</span>
      </p>
      <p>
        <strong>{{ $t("entertainment.sidebar.budget") }}</strong>
        <span
          :class="{
            'font-semibold text-blue-800': budget !== '-'
          }"
          >{{ budget }}</span
        >
      </p>
      <p>
        <strong>{{ $t("entertainment.sidebar.revenue") }}</strong>
        <span
          :class="{
            'font-semibold text-green-800': revenue !== '-'
          }"
          >{{ revenue }}</span
        >
      </p>
      <p v-if="getCreator">
        <strong>{{ $t("entertainment.sidebar.created_by") }}</strong>
        <span class="flex flex-col">
          <NuxtLink
            :to="`/details/person/${creator.id}`"
            v-for="creator in getCreator"
            class="hover:underline"
            >{{ creator.name }}</NuxtLink
          >
        </span>
      </p>
      <div v-if="props.data?.imdb_id || rtScore">
        <strong>{{ $t("entertainment.sidebar.other") }}</strong>
        <div class="flex w-fit gap-2">
          <IMDBLink
            v-if="props.data?.imdb_id"
            :imdb="props.data?.imdb_id"
            :score="imdbScore"
          />
          <RottenTomatoes v-if="rtScore" :score="rtScore" />
        </div>
      </div>
      <a
        v-if="website && website.length > 0"
        :href="website"
        rel="noopener noreferrer nofollow"
        target="_blank"
        class="flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <Icon name="ic:round-link" class="h-6 w-6" />
        <span>{{ $t("entertainment.sidebar.visit_website") }}</span>
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
