<script setup>
// @ts-ignore
import ColorThief from "colorthief"
import ModalView from "~/components/Modal.vue"
import { useUserStore } from "~/store/user"
import { onClickOutside, useStorage } from "@vueuse/core"
import { useDark } from "@vueuse/core"
import { Switch } from "@headlessui/vue"

const { $moment, $getTitle } = useNuxtApp()
const { params } = useRoute()
const colorThief = new ColorThief()
const isDark = useDark()
const { feature } = useRoute().query
const flag = useStorage("debugMode", false)

const { user, isLoggedIn } = useUserStore()

const { data, pending } = useLazyFetch(
  `/api/tmdb/${params.id}?type=${params.type}`
)

const backgroundColor = ref([3, 50, 71])
const likes = ref(0)
const reviews = ref(0)
const reviewModal = ref(false)
const reviewRating = ref(0.5)
const reviewComment = ref("")
const spoiler = ref(false)
const comments = ref([])
const showDetailsDev = ref(false)
const emojiPicker = ref(null)
const isEmojiSelector = ref(false)
onClickOutside(emojiPicker, () => {
  isEmojiSelector.value = false
})
const reviewDataFromServer = reactive({
  rating: 0.5,
  comment: "",
  spoiler: false,
  loading: true
})
const masterRating = ref(0)
const backgroundBright = computed(() => {
  return backgroundColor.value[0] * 0.299 +
    backgroundColor.value[1] * 0.587 +
    backgroundColor.value[2] * 0.114 >
    186
    ? true
    : false
})
const backgroundURL = computed(() => {
  return data.value.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${data.value.backdrop_path}`
    : undefined
})
const posterURL = computed(() => {
  return data.value.poster_path
    ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.value.poster_path}`
    : undefined
})
const title = computed(() => {
  return data.value ? $getTitle(data.value) : "..."
})
const overview = computed(() => {
  return data.value.localData?.info.description
})
const imdbScore = computed(() => {
  return (
    data.value.localData?.info?.ratings?.imdb ||
    data.value.localData?.info?.ratings?.tmdb
  )
})
const contentRating = computed(() => {
  return data.value.localData?.info.rated
})

const genres = computed(() => {
  return data.value.genres && data.value.genres.length > 0
    ? data.value.genres.map((genre) => genre.name).join(", ")
    : ""
})
const runtime = computed(() => {
  return $moment
    .duration(
      data.value.runtime ||
        (data.value.episode_run_time && data.value.episode_run_time[0]) ||
        45,
      "minutes"
    )
    .format("h[h] m[m]")
})
const releaseDate = computed(() => {
  return $moment(
    data.value.release_date || data.value.first_air_date || 0
  ).format("YYYY")
})

const userLiked = computed(() => {
  return user?.likes?.includes(localId.value)
})

const userReviewed = computed(() => {
  return user?.reviews?.includes(localId.value)
})

const userAddedWatchlist = computed(() => {
  return user?.watchlist?.includes(localId.value)
})

const localId = computed(() => {
  return data.value.localId || "id"
})

const like = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  if (user?.likes && user.likes.includes(localId.value)) {
    user.likes = user.likes.filter((e) => e !== localId.value)
  } else {
    user.likes.push(localId.value)
  }
  const { likes: entertainmentLikes } = await $fetch(`/api/likes`, {
    method: "POST",
    body: JSON.stringify({
      id: localId.value,
      type: userLiked.value ? "add" : "remove"
    }),
    headers: generateHeaders()
  })
  likes.value = entertainmentLikes
}
const fetchLikes = async () => {
  const { likes: entertainmentLikes } = await $fetch(
    `/api/likes/${data.value.localId}`
  )
  likes.value = entertainmentLikes
}
const fetchReviews = async () => {
  reviewDataFromServer.loading = true
  const review = await $fetch(`/api/reviews/${localId.value}`, {
    headers: generateHeaders()
  })
  if ("message" in review) {
    return
  }
  comments.value = review.reviews
  if (review.review && review.review.rating) {
    reviewDataFromServer.rating = review.review.rating
    if (review.review.content)
      reviewDataFromServer.comment = review.review.content
    if (review.review.spoiler) reviewDataFromServer.spoiler = true
  }
  reviews.value = review.count
  masterRating.value = review.averageRating
  reviewDataFromServer.loading = false
}

const openReview = () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  reviewModal.value = true
  reviewComment.value = reviewDataFromServer.comment
  reviewRating.value = reviewDataFromServer.rating
  spoiler.value = reviewDataFromServer.spoiler
}

const submitReview = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  if (!user.reviews.includes(localId.value)) {
    user.reviews.push(localId.value)
    reviews.value += 1
  }
  reviewModal.value = false

  reviewDataFromServer.rating = reviewRating.value
  reviewDataFromServer.comment = reviewComment.value
  await $fetch(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify({
      id: localId.value,
      rating: reviewRating.value,
      review: reviewComment.value,
      spoiler: spoiler.value
    }),
    headers: generateHeaders()
  })
  fetchReviews()
}

const deleteReview = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  if (user.reviews.includes(localId.value)) {
    user.reviews = user.reviews.filter((e) => e !== localId.value)
    reviews.value -= 1
  }
  reviewModal.value = false

  reviewDataFromServer.rating = 0.5
  reviewDataFromServer.comment = ""
  await $fetch(`/api/reviews`, {
    method: "DELETE",
    body: JSON.stringify({
      entertainment: localId.value
    }),
    headers: generateHeaders()
  })
  fetchReviews()
}

const submitToWatchlist = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  if (user.watchlist.includes(localId.value)) {
    user.watchlist = user.watchlist.filter((e) => e !== localId.value)
  } else {
    user.watchlist.push(localId.value)
  }
  await $fetch(`/api/users/me/watchlist`, {
    method: "POST",
    body: JSON.stringify({
      id: localId.value,
      type: userAddedWatchlist.value ? "add" : "remove"
    }),
    headers: generateHeaders()
  })
}

watch(data, async () => {
  if (posterURL.value) {
    const image = new Image()
    image.setAttribute("crossOrigin", "Anonymous")
    image.src = posterURL.value
    image.onload = () => {
      backgroundColor.value = colorThief.getColor(image)
    }
    image.onerror = () => {
      console.log("error on image color analysis")
    }
  }

  fetchLikes()
  fetchReviews()
})

watch(reviewRating, () => {
  if (reviewRating.value < 0.5) {
    reviewRating.value = 0.5
  }
})

const onSelectEmoji = (emoji) => {
  reviewComment.value += emoji.i
}

useHead({
  title,
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <div v-if="pending" class="flex h-96 items-center justify-center">
    <Spinner color="#000" />
  </div>
  <div v-else-if="!data || ('status' in data && 'message' in data)">
    <div class="flex h-96 flex-col items-center justify-center">
      <h1 class="text-4xl font-semibold">404</h1>
      <p class="text-xl">Entertainment not found</p>
    </div>
  </div>
  <div v-else>
    <ModalView :show="reviewModal" @close="reviewModal = false" title="Review">
      <template v-slot:body>
        <div class="space-y-4">
          <div>
            <p class="flex items-center gap-2 text-lg font-semibold">
              Your Rating:
              <input
                class="h-6 w-11 rounded p-0 text-center focus:outline-none focus:ring-0 dark:bg-zinc-700"
                type="number"
                :max="10"
                :min="0.5"
                step="0.1"
                @input="
                  (e) => {
                    reviewRating = e.target.value
                  }
                "
                :value="reviewRating"
              />
            </p>
            <StarRating
              :animate="true"
              :increment="0.1"
              :max-rating="10"
              :star-size="39"
              :show-rating="false"
              :star-points="[
                23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43, 38, 50, 36, 34, 46,
                19, 31, 17
              ]"
              :active-border-color="['#a30000', '#ffc400']"
              :active-color="['#f00', '#ff0']"
              :inactive-color="isDark ? '#000' : '#fff'"
              :border-width="2"
              :active-on-click="true"
              v-model:rating="reviewRating"
            ></StarRating>
          </div>
          <div>
            <div class="relative mb-2 flex items-center justify-between">
              <p class="select-none text-lg font-semibold">Comment</p>

              <Transition name="fade">
                <EmojiPicker
                  v-show="isEmojiSelector"
                  ref="emojiPicker"
                  class="absolute right-0 z-20"
                  :display-recent="true"
                  :native="true"
                  :theme="isDark ? 'dark' : 'light'"
                  @select="onSelectEmoji"
                />
              </Transition>
            </div>

            <div class="relative">
              <textarea
                type="text"
                :value="reviewComment"
                :maxlength="512"
                @input="(e) => (reviewComment = e.target.value)"
                placeholder="Write a review..."
                class="h-32 w-full select-none resize-none rounded border-gray-400 dark:border-zinc-800 dark:bg-zinc-800"
              />
              <div
                class="absolute bottom-0 right-0 z-10 m-2 rounded text-sm text-gray-500 dark:text-gray-300"
              >
                <button
                  @click="isEmojiSelector = !isEmojiSelector"
                  class="p-1 hover:bg-gray-50 dark:hover:bg-zinc-600"
                >
                  <IconsEmoji class="h-8 w-8" />
                </button>
              </div>
            </div>
            <div
              class="flex items-center gap-2"
              v-if="reviewComment.trim().length > 0"
            >
              <Switch
                id="spoiler"
                v-model="spoiler"
                :class="spoiler ? 'bg-blue-700' : 'bg-teal-700'"
                class="relative inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span class="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  :class="spoiler ? 'translate-x-3.5' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
              <label
                for="spoiler"
                class="cursor-pointer select-none opacity-80"
              >
                My comment contains spoilers
              </label>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          @click="submitReview"
          class="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Submit Review
        </button>
      </template>
    </ModalView>
    <div
      class="relative h-full min-h-[820px] w-full bg-cover bg-center bg-no-repeat lg:h-[780px] lg:min-h-[780px]"
      :style="{
        'background-image': backgroundURL ? `url(${backgroundURL})` : 'none'
      }"
    >
      <div
        v-if="feature"
        class="fixed bottom-0 right-0 z-10 m-2 shadow-2xl lg:absolute lg:m-4"
      >
        <HomeRandomMovie :collapsed="true" />
      </div>
      <div
        class="h-full w-full"
        :style="{
          'background-color': `rgba(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]}, 0.75)`
        }"
      >
        <div
          class="container m-auto flex h-full min-h-[820px] w-full items-center justify-center px-4 lg:min-h-0 lg:justify-start"
        >
          <div
            class="flex h-full w-full flex-col items-center justify-center gap-8 py-8 drop-shadow-2xl lg:flex-row lg:justify-start lg:gap-16 lg:py-0"
          >
            <div class="relative flex-shrink-0">
              <img
                v-if="posterURL"
                class="h-auto w-56 rounded object-cover object-center lg:w-72"
                draggable="false"
                :src="posterURL"
              />
              <div
                v-else
                class="flex h-80 w-56 items-center justify-center rounded bg-gray-700 text-xl font-semibold !text-white lg:h-96 lg:w-72"
              >
                No Image
              </div>
              <div
                v-if="masterRating > 0"
                class="absolute bottom-0 left-0 m-2 flex items-center justify-center gap-2 rounded bg-gray-600/20 px-3 py-2 font-semibold !text-white shadow-sm backdrop-blur-md"
              >
                <IconsStarFilled class="h-5 w-5 text-yellow-400" />
                {{ masterRating.toFixed(1) }}
              </div>
            </div>
            <div class="w-full max-w-2xl">
              <div class="flex flex-col-reverse text-center lg:text-left">
                <h1
                  class="inline-block flex-shrink-0 font-semibold leading-8 lg:leading-none"
                  :class="{
                    'text-4xl md:text-5xl lg:text-6xl': title.length < 20,
                    'text-3xl md:text-4xl lg:text-5xl': title.length < 36,
                    'text-2xl md:text-3xl lg:text-4xl': title.length >= 36,
                    'text-black': backgroundBright,
                    'text-white': !backgroundBright
                  }"
                >
                  {{ title }}
                </h1>
                <!-- Mobile Extensions -->
                <div
                  class="my-2 flex items-center justify-center gap-2 lg:hidden"
                >
                  <h2
                    v-if="contentRating && contentRating !== 'Not Rated'"
                    class="border px-2 text-lg font-semibold line-clamp-1"
                    :class="{
                      'border-black/40 text-black': backgroundBright,
                      'border-white/40 text-white/70': !backgroundBright
                    }"
                  >
                    {{ contentRating || "NR" }}
                  </h2>
                  <IMDBLink
                    v-if="data?.imdb_id"
                    :imdb="data?.imdb_id"
                    :score="imdbScore || data.vote_average"
                  />
                  <RottenTomatoes
                    v-if="data.localData?.info?.ratings?.rotten_tomatoes"
                    :score="data.localData?.info?.ratings?.rotten_tomatoes"
                  />
                </div>
                <div
                  class="flex items-center justify-center divide-x-2 text-xs sm:text-sm lg:justify-start lg:text-lg"
                  :class="{
                    'divide-black/20 text-black': backgroundBright,
                    'divide-white/20 text-white/70': !backgroundBright
                  }"
                >
                  <h2 class="ml-0.5 pr-2 font-semibold">
                    {{ releaseDate }}
                  </h2>
                  <h2
                    v-if="genres"
                    class="break-all px-2 font-semibold line-clamp-1"
                  >
                    {{ genres }}
                  </h2>
                  <h2 class="flex-shrink-0 px-2 font-semibold line-clamp-1">
                    {{ runtime }}
                  </h2>

                  <div
                    class="hidden flex-shrink-0 items-center gap-2 px-2 lg:flex"
                  >
                    <h2
                      v-if="contentRating && contentRating !== 'Not Rated'"
                      class="border px-2 text-lg font-semibold line-clamp-1"
                      :class="{
                        'border-black/40': backgroundBright,
                        'border-white/40': !backgroundBright
                      }"
                    >
                      {{ contentRating || "NR" }}
                    </h2>
                    <IMDBLink
                      v-if="data?.imdb_id"
                      :imdb="data?.imdb_id"
                      :score="imdbScore || data.vote_average"
                    />
                    <RottenTomatoes
                      v-if="data.localData?.info?.ratings?.rotten_tomatoes"
                      :score="data.localData?.info?.ratings?.rotten_tomatoes"
                    />
                  </div>
                </div>
              </div>
              <p
                class="mt-2 text-center text-base line-clamp-6 lg:text-left lg:text-xl"
                :class="{
                  'text-black/80': backgroundBright,
                  'text-white/80 ': !backgroundBright
                }"
              >
                {{ overview }}
              </p>
              <div class="mt-4 flex flex-col gap-2 text-lg lg:flex-row">
                <button
                  @click="like"
                  class="flex items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:bg-opacity-80"
                >
                  <IconsThumbUpFilled v-if="userLiked" class="h-6 w-6" />
                  <IconsThumbUpUnfilled v-else class="h-6 w-6" />
                  {{ userLiked ? "Recommended" : "Recommend" }}
                </button>
                <button
                  @click="openReview"
                  class="flex items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:bg-opacity-80"
                >
                  <IconsStarFilled v-if="userReviewed" class="h-6 w-6" />
                  <IconsStar v-else class="h-6 w-6" />
                  {{ userReviewed ? "Reviewed" : "Review" }}
                </button>
                <button
                  v-if="!userAddedWatchlist"
                  @click="submitToWatchlist"
                  class="flex items-center gap-1 rounded border bg-transparent px-4 py-2 font-semibold transition hover:opacity-80"
                  :class="{
                    'border-black text-black': backgroundBright,
                    'border-white text-white': !backgroundBright
                  }"
                >
                  <IconsListAdd class="h-6 w-6" />
                  Add to watchlist
                </button>
                <button
                  v-else
                  @click="submitToWatchlist"
                  class="flex items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:opacity-80"
                >
                  <IconsListRemove class="h-6 w-6" />
                  Remove from watchlist
                </button>
              </div>
              <div
                :class="{
                  'divide-black/20 text-black/80': backgroundBright,
                  'divide-white/20 text-white/80': !backgroundBright
                }"
                class="mt-2 flex gap-2 divide-x-2 text-sm"
              >
                <p>
                  {{ likes }}
                  {{ likes <= 1 ? "person" : "people" }} recommended
                </p>
                <p class="pl-2">{{ reviews }} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto mt-8 mb-28 px-4">
      <div class="flex flex-col-reverse items-stretch gap-4 lg:flex-row">
        <div class="relative min-w-0 flex-1 space-y-10 lg:space-y-16">
          <DetailsCast :id="params.id" :type="params.type" />
          <DetailsReviews
            :loading="reviewDataFromServer.loading"
            :data="comments"
            @edit="openReview"
            @remove="deleteReview"
          />
        </div>
        <DetailsSidebar
          class="static top-0 w-full self-start lg:sticky lg:min-w-[300px] lg:max-w-[300px]"
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
          <JsonViewer :value="data" copyable sort expanded theme="jsonviewer" />
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
