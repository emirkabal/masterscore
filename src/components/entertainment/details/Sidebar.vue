<script setup lang="ts">
import { TMDBData } from "~/@types"
import ScreenModal from "~/components/ScreenModal.vue"
const { $getTitle, $moment } = useNuxtApp()
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

const { data: providerData, pending: providerPending } = useLazyFetch(
  `/api/extra/providers/${props.data.id}?type=${props.data.localData.type}`
)

const trailerModal = ref(false)

const getDateDiff = (date: string) => {
  const diff = $moment().diff(date, "days")
  if (diff === 0) {
    return "Today"
  } else if (diff === 1) {
    return "Yesterday"
  } else if (diff < 7) {
    return `${diff} days ago`
  } else if (diff < 30) {
    return `${Math.floor(diff / 7)} weeks ago`
  } else if (diff < 365) {
    return `${Math.floor(diff / 30)} months ago`
  } else {
    return `${Math.floor(diff / 365)} years ago`
  }
}

const status = computed(() => {
  if (
    props.data.status &&
    props.data.status === "Released" &&
    props.data.release_date
  ) {
    const releaseDate = $moment(props.data.release_date)
    return `Released: ${releaseDate.format("MMMM D, YYYY")}<br/>${getDateDiff(
      props.data.release_date
    )}`
  } else if (
    props.data.status &&
    props.data.status === "Ended" &&
    props.data.first_air_date &&
    props.data.last_air_date
  ) {
    const firstAirDate = $moment(props.data.first_air_date)
    const lastAirDate = $moment(props.data.last_air_date)
    return `Ended at: ${lastAirDate.format(
      "MMMM D, YYYY"
    )}<br/>${firstAirDate.format("YYYY")}-${lastAirDate.format(
      "YYYY"
    )}<br/>${getDateDiff(props.data.last_air_date)}`
  } else if (
    props.data.status &&
    props.data.status === "Returning Series" &&
    props.data.first_air_date &&
    props.data.next_episode_to_air
  ) {
    const nextAirDate = $moment(props.data.next_episode_to_air.air_date)
    return `Returning in: ${nextAirDate.format("MMMM D, YYYY")}`
  }

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

const getProvider = computed(() => {
  if (providerData.value && !providerPending.value) {
    return providerData.value.results.TR
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
        <IconsPlay class="h-6 w-6 text-yellow-600" />
        <span>Watch Trailer</span>
      </button>

      <div
        v-if="
          (!providerPending &&
            (getProvider?.flatrate || getProvider?.rent || getProvider?.buy)) ||
          smartVideoData
        "
      >
        <span class="font-bold">Available on</span>
        <div class="flex items-center gap-2">
          <span
            v-if="smartVideoData"
            v-tooltip="{
              content: `Watch on <b>Masterscore</b>. (you are already here <3)`,
              html: true
            }"
            class="flex h-10 w-10 cursor-default items-center justify-center rounded-lg bg-gray-100 bg-cover bg-center bg-no-repeat font-maven text-3xl font-black text-yellow-500 transition-opacity hover:opacity-75 dark:bg-zinc-900"
          >
            <span class="-mt-1 select-none"> m </span>
          </span>
          <a
            v-if="
              !providerPending &&
              (getProvider?.flatrate || getProvider?.rent || getProvider?.buy)
            "
            v-for="provider in getProvider.flatrate ||
            getProvider.rent ||
            getProvider.buy"
            :key="provider.provider_id"
            :href="getProvider.link"
            target="_blank"
            v-tooltip="{
              content: `Watch on <b>${provider.provider_name}</b>.`,
              html: true
            }"
            class="h-10 w-10 rounded-lg bg-cover bg-center bg-no-repeat transition-opacity hover:opacity-75"
            :style="{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${provider.logo_path})`
            }"
          >
          </a>
        </div>
        <div
          class="text-xs"
          v-if="getProvider?.flatrate || getProvider?.rent || getProvider?.buy"
        >
          <span class="mr-2 text-gray-600 dark:text-gray-50">Powered by</span>
          <a href="https://www.justwatch.com/" target="_blank"
            ><img
              class="mb-1 inline-block h-auto w-20"
              src="~/assets/images/justwatch-logo.png"
              alt=""
          /></a>
        </div>
      </div>
      <div v-else-if="providerPending" class="space-y-2">
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
        <div
          class="skeleton-effect h-2 w-1/3 rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
      </div>

      <EntertainmentCard
        class="w-full"
        v-if="data.belongs_to_collection"
        title="Belongs To Collection"
        :entertainment="{
          id: '0',
          type: '0',
          info: {
            release_date: '0',
            title: data.belongs_to_collection.name.replace(' Collection', ''),
            poster: data.belongs_to_collection.poster_path,
            backdrop: data.belongs_to_collection.backdrop_path
          }
        }"
        :to="$route.path"
      />

      <p v-if="originalName">
        <strong>Original Name</strong>
        <span>{{ originalName }}</span>
      </p>
      <p>
        <strong>Status</strong>
        <span v-html="status"></span>
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
        <span>{{ spokenLanguages }}</span>
      </p>
      <p v-if="localName">
        <strong>English Name</strong>
        <span>{{ localName }}</span>
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
      <p v-if="getCreator">
        <strong>Created By</strong>
        <span class="flex flex-col">
          <NuxtLink
            :to="`/details/person/${creator.id}`"
            v-for="creator in getCreator"
            class="hover:underline"
            >{{ creator.name }}</NuxtLink
          >
        </span>
      </p>
      <a
        v-if="website && website.length > 0"
        :href="website"
        rel="noopener noreferrer nofollow"
        target="_blank"
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
