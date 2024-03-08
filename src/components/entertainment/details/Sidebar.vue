<script setup lang="ts">
import type { ProviderResults, CollapsedMedia } from "~/types"
const { t, locale } = useI18n()
const { $getTitle, $getOriginalTitle, $moment } = useNuxtApp()
const { userAgent } = useDevice()
const props = defineProps<{
  data: CollapsedMedia
}>()

defineEmits(["watchTrailer"])

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol"
})

const { data: providerData, pending: providerPending } = useLazyFetch<ProviderResults>(
  `https://watchhub.strem.io/stream/movie/${
    props.data.external_ids?.imdb_id || props.data.imdb_id
  }.json`
)

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
    )}<br/>${firstAirDate.format("YYYY")}-${lastAirDate.format("YYYY")}<br/>${getDateDiff(
      props.data.last_air_date
    )}`
  } else if (
    props.data?.status === "Returning Series" &&
    props.data.first_air_date &&
    props.data.next_episode_to_air
  ) {
    const nextAirDate = $moment(props.data.next_episode_to_air.air_date).locale(locale.value)
    return `${t("entertainment.sidebar.returning_in")}: ${nextAirDate.format("MMMM D, YYYY")}`
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
    props.data.spoken_languages?.find((e) => e.iso_639_1 === props.data.original_language)?.name ||
    t("unknown")
  )
})

const spokenLanguages = computed(() => {
  return props.data.spoken_languages?.map((e) => e.name).join(", ") || t("unknown")
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
  let title = $getOriginalTitle(props.data)
  return title === "Untitled" ? null : title
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

const externalScores = computed(() => {
  return props.data.media.scores
})
</script>

<template>
  <div class="z-10 w-full rounded-3xl p-0 lg:px-6 lg:pt-6">
    <div class="space-y-6">
      <div v-if="providerPending" class="space-y-2">
        <div class="skeleton-effect h-2 w-1/2 rounded-full bg-gray-300 dark:bg-gray-900"></div>
        <div class="flex items-center gap-2">
          <div class="skeleton-effect h-10 w-10 rounded-lg bg-gray-300 dark:bg-gray-900"></div>
          <div class="skeleton-effect h-10 w-10 rounded-lg bg-gray-300 dark:bg-gray-900"></div>
          <div class="skeleton-effect h-10 w-10 rounded-lg bg-gray-300 dark:bg-gray-900"></div>
        </div>
      </div>
      <div v-else-if="providerData?.streams?.length">
        <span class="font-bold">{{ $t("entertainment.sidebar.availabe_on") }}</span>
        <div class="flex flex-wrap items-center gap-2">
          <a
            v-if="providerData?.streams?.length"
            v-for="provider in providerData.streams"
            :key="provider.name"
            :href="userAgent.includes('webOS') ? provider.androidTvUrl : provider.externalUrl"
            target="_blank"
            v-tooltip="{
              content: `<b>${provider.name}</b>, ${provider.title}`,
              html: true
            }"
            class="h-10 w-10 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat transition-opacity hover:opacity-75"
            :style="{
              backgroundImage: `url(${
                $getProvider(provider.name) &&
                `https://image.tmdb.org/t/p/original/${$getProvider(provider.name)?.logo}`
              })`
            }"
          >
            <img
              v-if="!$getProvider(provider.name)"
              :src="'https://api.dicebear.com/7.x/initials/svg?seed=' + provider.name"
              :alt="provider.name"
            />
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
            title: data.belongs_to_collection.name.replace(' Collection', '').replace('[Seri]', ''),
            poster: data.belongs_to_collection.poster_path,
            backdrop: data.belongs_to_collection.backdrop_path
          }
        }"
        :to="$route.path"
      />
      <p v-if="originalName && originalName !== $getTitle(data)">
        <strong>{{ $t("entertainment.sidebar.original_name") }}</strong>
        <span
          >{{ originalName
          }}{{ originalName !== data.media.title ? ` (${data.media.title})` : "" }}</span
        >
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
            'font-semibold text-orange-200': budget !== '-'
          }"
          >{{ budget }}</span
        >
      </p>
      <p>
        <strong>{{ $t("entertainment.sidebar.revenue") }}</strong>
        <span
          :class="{
            'font-semibold text-brand': revenue !== '-'
          }"
          >{{ revenue }}</span
        >
      </p>
      <div
        v-if="
          externalScores?.imdb ||
          externalScores?.rotten_tomatoes ||
          externalScores?.metacritic ||
          externalScores?.tmdb
        "
      >
        <strong>{{ $t("entertainment.sidebar.other") }}</strong>
        <div class="mt-2 flex w-fit flex-wrap gap-2">
          <ExternalScore
            v-if="externalScores.imdb"
            platform="imdb"
            :to="
              data.external_ids?.imdb_id &&
              `https://www.imdb.com/title/${data.external_ids?.imdb_id}`
            "
            :score="externalScores.imdb"
          />
          <ExternalScore
            v-if="externalScores.rotten_tomatoes"
            platform="rotten"
            :score="`${externalScores.rotten_tomatoes}%`"
          />
          <ExternalScore
            v-if="externalScores.metacritic"
            platform="metacritic"
            :score="externalScores.metacritic"
          />
          <ExternalScore
            v-if="externalScores.tmdb"
            platform="tmdb"
            :score="externalScores.tmdb"
            :to="`https://www.themoviedb.org/${data.media.type}/${data.id}`"
          />
          <!-- <RottenTomatoes v-if="rtScore" :score="rtScore" /> -->
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
  @apply block;
}
</style>
