<script setup>
import tinycolor from "tinycolor2"
import { useStorage } from "@vueuse/core"
import { useUserStore } from "~/store/user"
const { $event, $listen, $colorthief } = useNuxtApp()
const { params, query } = useRoute()
const { feature } = query
const flag = useStorage("debugMode", false)

const { user, isLoggedIn } = useUserStore()

const { data, pending } = useLazyFetch(
  `/api/tmdb/${params.id}?type=${params.type}`
)

const colors = reactive({
  background: [3, 50, 71],
  gradient: [3, 50, 71]
})

const comments = ref([])
const showDetailsDev = ref(false)

const reviewData = reactive({
  count: 0,
  rating: 0.5,
  comment: "",
  spoiler: false,
  loading: true
})
const masterRating = ref(0)
const backgroundBright = computed(() => {
  return tinycolor("rgb " + colors.background.join(" "))
    .darken()
    .isLight()
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
  masterRating.value = review.averageRating
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
  if (posterURL.value) {
    const image = new Image()
    image.setAttribute("crossOrigin", "Anonymous")
    image.src = posterURL.value
    image.onload = () => {
      const dominantColor = $colorthief.getColor(image)
      colors.background = dominantColor
      const gradient = Object.values(
        tinycolor("rgb " + dominantColor.join(" "))
          .darken(45)
          .toRgb()
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
})

watch(colors, (val) => {
  if (val) {
    $event("entertainment:bright", backgroundBright.value)
  }
})

useHead({
  title: "...",
  titleTemplate: "%s - Masterscore"
})
definePageMeta({
  pageTransition: {
    name: "none"
  }
})
</script>

<template>
  <EntertainmentLoading v-if="pending" />
  <div v-else-if="!data && !reviewData">
    <div class="flex h-96 flex-col items-center justify-center">
      <h1 class="text-4xl font-semibold">404</h1>
      <p class="text-xl">Entertainment not found</p>
    </div>
  </div>
  <div v-else-if="data && reviewData">
    <EntertainmentReviewModal :data="data" :reviewData="reviewData" />
    <EntertainmentContainer
      :colors="colors"
      :background-u-r-l="backgroundURL"
      :feature="feature"
    >
      <EntertainmentPoster :poster-u-r-l="posterURL" :rating="masterRating" />
      <div class="w-full max-w-2xl">
        <EntertainmentBody :data="data" :is-light="backgroundBright" />
        <EntertainmentButtonGroup
          :data="data"
          :isLight="backgroundBright"
          @openReview="openReview"
          :reviewData="reviewData"
        />
      </div>
    </EntertainmentContainer>

    <div class="container mx-auto mt-8 mb-28 px-4">
      <div class="flex flex-col-reverse items-stretch gap-4 lg:flex-row">
        <div class="relative min-w-0 flex-1 space-y-10 lg:space-y-16">
          <DetailsCast :id="params.id" :type="params.type" />
          <DetailsReviews
            :loading="reviewData.loading"
            :data="comments"
            @edit="openReview"
            @remove="deleteReview"
          />
        </div>
        <DetailsSidebar
          class="static top-14 w-full self-start lg:sticky lg:min-w-[300px] lg:max-w-[300px]"
          :data="data"
        />
      </div>

      <div v-if="flag">
        <button
          @click="showDetailsDev = !showDetailsDev"
          class="font-semibod mt-8 rounded bg-white px-4 py-2 shadow dark:bg-zinc-900"
        >
          {{ showDetailsDev ? "Hide" : "Show" }} details
        </button>
        <div v-if="showDetailsDev">
          <p>Movie {{ params.id }}</p>
          {{ backgroundColor }}
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
</template>

<style>
.vue-star-rating > span > svg {
  @apply h-6 w-6 lg:h-10 lg:w-10;
}
</style>
