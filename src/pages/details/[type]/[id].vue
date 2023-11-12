<script setup>
import tinycolor from "tinycolor2"
import { useStorage } from "@vueuse/core"
import { useUserStore } from "~/store/user"
const { $event, $listen, $colorthief, $getOriginalTitle } = useNuxtApp()
const { params, query } = useRoute()
const { feature } = query
const flag = useStorage("debugMode", false)

const { user, isLoggedIn } = useUserStore()

const { data, pending, refresh } = useLazyFetch(
  `/api/tmdb/${params.id}?type=${params.type}`
)

const watchModal = ref(false)
const smartVideoData = ref(null)
const smartVideoId = ref("")
const smartVideoPending = ref(false)
const smartVideoError = ref(false)
const smartVideoEpisodes = shallowRef([])

const colors = reactive({
  background: [3, 50, 71],
  gradient: [3, 50, 71]
})

const comments = ref([])
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
const backgroundBright = computed(() => {
  // return tinycolor("rgb " + colors.background.join(" "))
  //   .darken()
  //   .isLight()
  return false
})
const backgroundURL = computed(() => {
  return data && data.value.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${data.value.backdrop_path}`
    : undefined
})
const posterURL = computed(() => {
  return data && data.value.poster_path
    ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.value.poster_path}`
    : undefined
})

const fetchReviews = async () => {
  reviewData.loading = true
  const review = await $fetch(`/api/reviews/${data.value.localId}`, {
    headers: generateHeaders()
  })
  if ("message" in review) {
    return
  }
  comments.value = review.reviews
  if (review.review && review.review.rating) {
    reviewData.rating = review.review.rating
    if (review.review.content) reviewData.comment = review.review.content
    if (review.review.spoiler) reviewData.spoiler = true
  }
  reviewData.count = review.count
  reviewData.good = review?.average?.good || 0
  reviewData.poor = review?.average?.poor || 0
  masterRating.value = review?.average?.rating || 0
  reviewData.loading = false
}

const openReview = () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  $event("modal:review", true)
}

const deleteReview = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  if (user.reviews.includes(data.value.localId)) {
    user.reviews = user.reviews.filter((e) => e !== data.value.localId)
    reviewData.count -= 1
  }

  $event("modal:review", false)

  reviewData.rating = 0.5
  reviewData.comment = ""
  await $fetch(`/api/reviews`, {
    method: "DELETE",
    body: JSON.stringify({
      entertainment: data.value.localId
    }),
    headers: generateHeaders()
  })
  fetchReviews()
}

watch(data, async () => {
  if (posterURL.value && process.client) {
    const image = new Image()
    image.setAttribute("crossOrigin", "Anonymous")
    image.src = posterURL.value
    image.onload = () => {
      const dominantColor = $colorthief.getColor(image, {
        algorithm: "dominant"
      })
      colors.background = dominantColor.value
      const gradient = Object.values(
        tinycolor(dominantColor.rgb).darken(45).toRgb()
      )
      colors.gradient = gradient
    }
    image.onerror = () => {
      console.log("error on image color analysis")
    }
  }

  fetchReviews()
  $listen("entertainment:fetch:reviews", fetchReviews)

  setTimeout(() => {
    $event("entertainment:load", true)
  }, 400)

  if (isLoggedIn && user.features.includes("WATCH")) {
    smartVideoPending.value = true
    const find = async (title) => {
      smartVideoData.value = await $fetch(
        `https://api.emirkabal.com/v1/smartvideo/${
          params.type === "tv" ? "series" : "movies"
        }?q=${title}`,
        {
          timeout: 10000
        }
      ).catch((e) => {
        if (e?.name === "AbortError") {
          smartVideoError.value = true
        }
      })

      smartVideoPending.value = null

      if (
        smartVideoData.value &&
        smartVideoData.value.length > 0 &&
        smartVideoData.value.find((e) => e.tmdb == data.value.id)
      ) {
        smartVideoData.value = smartVideoData.value.find(
          (e) => e.tmdb == data.value.id
        )
      }

      if (
        smartVideoData.value &&
        smartVideoData.value.length > 0 &&
        data.value.imdb_id &&
        smartVideoData.value.find((e) => e.imdb == data.value.imdb_id)
      ) {
        smartVideoData.value = smartVideoData.value.find(
          (e) => e.imdb == data.value.imdb_id
        )
      }

      if (
        smartVideoData.value &&
        smartVideoData.value.length > 0 &&
        data.value.release_date &&
        smartVideoData.value.find(
          (e) => e.year == data.value.release_date.split("-")[0]
        )
      ) {
        smartVideoData.value = smartVideoData.value.find(
          (e) => e.year == data.value.release_date.split("-")[0]
        )
      }
    }
    await find($getOriginalTitle(data.value))
    if (!smartVideoData.value || smartVideoData.value.length === 0) {
      if (data.value.belongs_to_collection && data.value.belongs_to_collection)
        await find(
          data.value.belongs_to_collection.name
            .replace(" Collection", "")
            .replace("[Seri]", "")
        )
      else await find(data.value.original_name || data.value.original_title)
    }
    if (
      smartVideoData.value &&
      smartVideoData.value.length > 0 &&
      params.type === "movie"
    ) {
      smartVideoData.value = smartVideoData.value[0]
    }
    if (smartVideoData.value && smartVideoData.value.length === 0) {
      smartVideoData.value = null
    }
    smartVideoPending.value = false
  }
})

watch(colors, (val) => {
  if (val) {
    $event("entertainment:bright", backgroundBright.value)
  }
})

$listen("entertainment:watch", (data) => {
  if (data.length) {
    smartVideoId.value = data[0]
    smartVideoEpisodes.value = {
      episode: data[1].episode_number,
      season: data[1].season_number
    }
  } else {
    smartVideoId.value = data
    smartVideoEpisodes.value = undefined
  }
  watchModal.value = true
})

$listen("entertainment:watch-feature-mismatch", () => {
  watchModal.value = false
  smartVideoId.value = null
  smartVideoData.value = null
  smartVideoPending.value = false
})

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
  <div v-else-if="data && reviewData">
    <EntertainmentWatch
      :watchModal="watchModal"
      :data="{
        title: $getTitle(data),
        poster: posterURL,
        backdrop: backgroundURL,
        tmdbId: data.id,
        imdbId: data.imdb_id,
        type: params.type,
        playlistId: smartVideoId,
        series: smartVideoEpisodes || undefined
      }"
      @close="
        () => {
          watchModal = false
        }
      "
    />
    <EntertainmentReviewModal :data="data" :reviewData="reviewData" />
    <EntertainmentContainer
      :colors="colors"
      :background-u-r-l="backgroundURL"
      :feature="feature"
    >
      <div class="relative">
        <EntertainmentPoster :poster-u-r-l="posterURL" />
        <div class="left-0 right-0 lg:absolute">
          <span
            v-if="smartVideoError && !smartVideoPending && !smartVideoData"
            v-tooltip.bottom="{
              content: 'Failed to check watch feature. Please try again later.'
            }"
            class="group mt-2 flex h-6 cursor-default select-none items-center justify-center"
          >
            <Icon name="ic:round-close" class="h-6 w-6 text-red-500" />
            <span
              class="text-white opacity-90 transition-opacity group-hover:opacity-100"
            >
              Failed to check watch feature
            </span>
          </span>
          <span
            v-else-if="
              smartVideoData &&
              smartVideoData.length > 0 &&
              smartVideoData[0]?.copyright
            "
            v-tooltip.bottom="{
              content: `Copy-righted content. You can't watch this ${
                params.type === 'movie' ? 'movie' : 'tv show'
              }.`,
              html: true
            }"
            class="group mt-2 flex h-6 cursor-default select-none items-center justify-center gap-1"
          >
            <Icon
              name="ic:round-warning-amber"
              class="h-6 w-6 text-yellow-400"
            />
            <span
              class="text-white opacity-90 transition-opacity group-hover:opacity-100"
            >
              Watch Unsupported
            </span>
          </span>
          <span
            v-else-if="smartVideoData"
            v-tooltip.bottom="{
              content: `You can watch this ${
                params.type === 'movie' ? 'movie' : 'tv show'
              } because you are a <b>eligible</b>.`,
              html: true
            }"
            class="group mt-2 flex h-6 cursor-default select-none items-center justify-center gap-1"
          >
            <Icon
              name="material-symbols:verified-rounded"
              class="h-6 w-6 text-yellow-400"
            />
            <span
              class="text-white opacity-90 transition-opacity group-hover:opacity-100"
              >Watch Supported</span
            >
          </span>
          <span
            v-else-if="smartVideoPending"
            class="group mt-2 flex h-6 cursor-default select-none items-center justify-center"
          >
            <Spinner class="-mr-1.5 scale-50" />
            <span
              class="text-white opacity-90 transition-opacity group-hover:opacity-100"
              >Checking watch feature...</span
            >
          </span>
        </div>
      </div>
      <div class="w-full max-w-4xl">
        <EntertainmentBody
          :data="data"
          :is-light="backgroundBright"
          :rating="masterRating"
          :reviewData="reviewData"
        />
        <EntertainmentButtonGroup
          :data="data"
          :isLight="backgroundBright"
          @openReview="openReview"
          :reviewData="reviewData"
          :smartVideoData="
            smartVideoData && !smartVideoData[0]?.copyright
              ? smartVideoData
              : null
          "
        />
      </div>
    </EntertainmentContainer>

    <div class="container mx-auto mb-28 mt-12 px-4 lg:-mt-28 2xl:-mt-36">
      <div class="flex flex-col-reverse items-stretch gap-4 lg:flex-row">
        <div class="relative min-w-0 flex-1 space-y-10 lg:space-y-16">
          <EntertainmentDetailsCollection
            v-if="data.belongs_to_collection"
            :data="data.belongs_to_collection"
          />
          <EntertainmentDetailsEpisodes
            v-if="data.seasons"
            :data="data"
            :smartVideoData="
              smartVideoData && !smartVideoData[0]?.copyright
                ? smartVideoData
                : null
            "
          />
          <EntertainmentDetailsSimilar :data="data.similar" />
          <EntertainmentDetailsCast :data="data.credits" />
          <EntertainmentDetailsReviews
            :loading="reviewData.loading"
            :data="comments"
            :mranking="{
              total: reviewData.count,
              rating: masterRating,
              good: reviewData.good,
              poor: reviewData.poor
            }"
            @edit="openReview"
            @remove="deleteReview"
          />
        </div>
        <EntertainmentDetailsSidebar
          class="static top-14 w-full self-start lg:sticky lg:min-w-[300px] lg:max-w-[300px]"
          :data="data"
          :smartVideoData="smartVideoData"
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
            <JsonViewer
              :value="data"
              copyable
              sort
              expanded
              theme="jsonviewer"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex h-96 flex-col items-center justify-center">
      <h1 class="text-4xl font-semibold">404</h1>
      <p class="text-xl">Page not found</p>
      <NuxtLink
        to="/"
        class="mt-4 rounded bg-white px-4 py-2 font-maven font-bold text-black hover:bg-gray-200"
        >Go back to home</NuxtLink
      >
    </div>
  </div>
</template>

<style>
.vue-star-rating > span > svg {
  @apply h-6 w-6 lg:h-10 lg:w-10;
}
</style>
