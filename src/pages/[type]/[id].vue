<script setup lang="ts">
import tinycolor from "tinycolor2"
import { useLocalStorage } from "@vueuse/core"

definePageMeta({
  validate: ({ params }) => ["movie", "tv"].includes(params.type as string)
})

const { $colorthief, $timage } = useNuxtApp()
const { params } = useRoute()
const flags = useLocalStorage("preferences", {} as any)

const route = useRoute()
const type = computed(() => route.params.type as "movie" | "tv")
const id = computed(() => (route.params.id as string).split("-").pop() as string)

const {
  data: data,
  status,
  error
} = await useAsyncData(`m:${type.value}${id.value}`, () => getMedia(type.value, id.value), {
  lazy: true
})

if (error.value) throw error.value

const trailerModal = ref(false)

const colors = reactive({
  background: [3, 50, 71],
  gradient: [3, 50, 71]
})

const showDetailsDev = ref(false)

const backdrop = computed(() => $timage(data.value?.backdrop_path || "-", "w1280"))
const poster = computed(() => $timage(data.value?.poster_path || "-", "w300_and_h450_bestv2"))

const getTeaser = computed(() => {
  if (!data.value?.videos?.results?.length) return "-"
  const vid = data.value?.videos.results.find(
    (e) => e.site === "YouTube" && (e.type === "Trailer" || e.type === "Teaser")
  )
  if (!vid) return "-"
  return `https://youtu.be/${vid.key}`
})

const detectColor = () => {
  if (process.client) {
    const image = new Image()
    image.setAttribute("crossOrigin", "Anonymous")
    image.src = poster.value
    image.onload = () => {
      const dominantColor = $colorthief.getColor(image, {
        algorithm: "sqrt"
      })
      colors.background = dominantColor.value
      const gradient = Object.values(tinycolor(dominantColor.rgb).darken(45).toRgb())
      colors.gradient = gradient
    }
    image.onerror = () => {}
  }
}
const title = computed(() =>
  data.value
    ? (data.value?.title || data.value?.name) +
      (data.value?.release_date || data.value?.first_air_date
        ? ` (${new Date(data.value?.release_date || data.value?.first_air_date).getFullYear()})`
        : "")
    : "..."
)
const description = computed(() => data.value?.overview)
const updateSeo = () => {
  useHead({
    title: title.value,
    titleTemplate: "%s - Masterscore",
    meta: [
      ...(description.value
        ? [
            {
              hid: "description",
              name: "description",
              content: description.value
            }
          ]
        : []),
      {
        property: "og:image",
        content: $timage(data.value?.poster_path || "-", "w300")
      }
    ]
  })
}

onMounted(() => {
  detectColor()
})

watch(data, () => {
  detectColor()
  updateSeo()
})

updateSeo()
</script>

<template>
  <EntertainmentLoading v-if="status === 'pending' || !data" />
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
    <EntertainmentContainer :colors="colors" :backdrop="backdrop">
      <div class="relative">
        <EntertainmentPoster :poster="poster" />
      </div>
      <div class="w-full max-w-5xl">
        <EntertainmentBody :data="data">
          <EntertainmentButtonGroup
            :data="data"
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
          <EntertainmentDetailsSimilar :data="data.recommendations" />
          <EntertainmentDetailsReviews :ctx="data" />
        </div>
        <EntertainmentDetailsSidebar
          class="static top-14 w-full self-start px-4 lg:sticky lg:min-w-[300px] lg:max-w-[300px]"
          :data="data"
        />
      </div>

      <ClientOnly>
        <div v-if="flags.debug_mode">
          <button
            @click="showDetailsDev = !showDetailsDev"
            class="font-semibod mt-8 rounded bg-gray-900 px-4 py-2 shadow"
          >
            {{ showDetailsDev ? "Hide" : "Show" }} details
          </button>
          <div v-if="showDetailsDev">
            <p>{{ params.type }}: {{ params.id }}</p>
            <JsonViewer :value="data" copyable sort expanded theme="jsonviewer" />
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.vue-star-rating > span > svg {
  @apply h-6 w-6 lg:h-10 lg:w-10;
}
</style>
