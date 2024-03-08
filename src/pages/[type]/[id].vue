<script setup>
import tinycolor from "tinycolor2"
import { useStorage } from "@vueuse/core"
import { useUserStore } from "~/store/user"
const { $event, $listen, $colorthief } = useNuxtApp()
const { params, query } = useRoute()
const { feature } = query
const flag = useStorage("debugMode", false)
const { user, isLoggedIn } = useUserStore()

const { data, pending, error } = await useAsyncData(
  `getMedia-${params.type}-${params.id}`,
  () => {
    return getMedia(params.type, params.id)
  },
  {
    lazy: true
  }
)

if (error.value) throw error.value

const trailerModal = ref(false)

const colors = reactive({
  background: [3, 50, 71],
  gradient: [3, 50, 71]
})

const showDetailsDev = ref(false)

const reviewData = reactive({
  count: 0,
  rating: 0.5,
  good: 0,
  poor: 0,
  comment: "",
  spoiler: false,
  loading: true
})
const masterRating = ref(0)
const backgroundURL = computed(() => {
  return data && data.value?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${data.value.backdrop_path}`
    : undefined
})
const posterURL = computed(() => {
  return data && data.value?.poster_path
    ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.value.poster_path}`
    : undefined
})

const getTeaser = computed(() => {
  if (!data.value.videos?.results?.length) return null
  const vid = data.value.videos.results.find(
    (e) => e.site === "YouTube" && (e.type === "Trailer" || e.type === "Teaser")
  )
  if (!vid) return null
  return `https://youtu.be/${vid.key}`
})

const detectColor = () => {
  if (process.client) {
    const image = new Image()
    image.setAttribute("crossOrigin", "Anonymous")
    image.src = posterURL.value
    image.onload = () => {
      const dominantColor = $colorthief.getColor(image, {
        algorithm: "sqrt"
      })
      colors.background = dominantColor.value
      const gradient = Object.values(tinycolor(dominantColor.rgb).darken(45).toRgb())
      colors.gradient = gradient
    }
    image.onerror = () => {
      console.log("error on image color analysis")
    }
  }
}

detectColor()
watch(data, detectColor)

$listen("refresh:entertainment", () => {
  refresh()
})

useHead({
  title: "...",
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <EntertainmentLoading v-if="pending" />
  <div
    v-else-if="data"
    :class="{
      'font-mono': data.media.id === '6413083c89dfe11b9d6c6dc4'
    }"
  >
    <ScreenModal v-if="getTeaser" :modal="trailerModal" @close="trailerModal = false">
      <iframe
        class="aspect-video h-auto w-full rounded-xl"
        :src="`https://www.youtube.com/embed/${getTeaser.split('/')[3]}?autoplay=1`"
      />
    </ScreenModal>
    <EntertainmentReviewModal :data="data" :reviewData="reviewData" />
    <EntertainmentContainer :colors="colors" :background-u-r-l="backgroundURL" :feature="feature">
      <div class="relative">
        <EntertainmentPoster :poster-u-r-l="posterURL" />
      </div>
      <div class="w-full max-w-5xl">
        <EntertainmentBody :data="data" :rating="masterRating" :reviewData="reviewData">
          <EntertainmentButtonGroup
            :data="data"
            :reviewData="reviewData"
            :teaser="getTeaser"
            @watchTrailer="trailerModal = true"
          />
        </EntertainmentBody>
        <EntertainmentDetailsTopCrew :data="data" />
      </div>
    </EntertainmentContainer>
    <EntertainmentButtonGroupMobile
      :id="data.media.id"
      :teaser="getTeaser"
      @watchTrailer="trailerModal = true"
    />

    <div class="container mx-auto mb-28 mt-12 px-0 lg:-mt-28 2xl:-mt-36">
      <div class="flex flex-col-reverse items-stretch gap-4 lg:flex-row">
        <div class="relative min-w-0 flex-1 space-y-10 lg:space-y-16">
          <EntertainmentDetailsCollection
            v-if="data.belongs_to_collection"
            :data="data.belongs_to_collection"
          />
          <EntertainmentDetailsEpisodes v-if="data.seasons" :data="data" />
          <EntertainmentDetailsCast :data="data.credits" />
          <EntertainmentDetailsSimilar :data="data.similar" />
          <EntertainmentDetailsReviews :id="data.media.id" />
        </div>
        <EntertainmentDetailsSidebar
          class="static top-14 w-full self-start px-4 lg:sticky lg:min-w-[300px] lg:max-w-[300px]"
          :data="data"
        />
      </div>

      <div v-if="flag">
        <button
          @click="showDetailsDev = !showDetailsDev"
          class="font-semibod mt-8 rounded bg-white px-4 py-2 shadow dark:bg-gray-900"
        >
          {{ showDetailsDev ? "Hide" : "Show" }} details
        </button>
        <div v-if="showDetailsDev">
          <p>{{ params.type }}: {{ params.id }}</p>
          <ClientOnly>
            <JsonViewer :value="data" copyable sort expanded theme="jsonviewer" />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vue-star-rating > span > svg {
  @apply h-6 w-6 lg:h-10 lg:w-10;
}
</style>
