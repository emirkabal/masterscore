<script setup>
import ColorThief from "colorthief"
import IconImdb from "~/components/icons/Imdb.vue"
import IconHeart from "~/components/icons/Heart.vue"
import IconHeartFilled from "~/components/icons/HeartFilled.vue"
import IconStar from "~/components/icons/Star.vue"
import IconStarFilled from "~/components/icons/StarFilled.vue"
import ModalView from "~/components/Modal.vue"
import Avatar from "~/components/Avatar.vue"
import { useUserStore } from "~/store/user"
import { onClickOutside } from "@vueuse/core"
import { useDark } from "@vueuse/core"
const { $moment } = useNuxtApp()
const { params } = useRoute()
const colorThief = new ColorThief()
const isDark = useDark()
const { feature } = useRoute().query

const { user, isLoggedIn } = useUserStore()

const { data, pending } = useLazyFetch(
  `/api/tmdb/${params.id}?type=${params.type}`
)
const imdbLoading = ref(false)
const backgroundColor = ref("transparent")
const likes = ref(0)
const reviews = ref(0)
const reviewModal = ref(false)
const reviewRating = ref(0.5)
const reviewComment = ref("")
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
  return `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${data.value.backdrop_path}`
})
const posterURL = computed(() => {
  return `https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.value.poster_path}`
})
const title = computed(() => {
  return data.value.title || data.value.name
})
const overview = computed(() => {
  return data.value.localData.info.description
})
const imdbScore = computed(() => {
  return (
    data.value.localData.info?.ratings?.imdb ||
    data.value.localData.info?.ratings?.tmdb
  )
})
const contentRating = computed(() => {
  return data.value.localData.info.contentRating
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
  return data.value.localId
})

const like = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  console.log("like", localId.value)
  if (user.likes.includes(localId.value)) {
    user.likes = user.likes.filter((e) => e !== localId.value)
  } else {
    user.likes.push(localId.value)
  }
  const { likes: entertainmentLikes } = await $fetch(`/api/likes`, {
    method: "POST",
    body: JSON.stringify({
      id: localId.value
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
    console.log(review.message)
    return
  }
  comments.value = review.reviews
  if (review.review && review.review.rating) {
    reviewDataFromServer.rating = review.review.rating
    if (review.review.content)
      reviewDataFromServer.comment = review.review.content
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
      review: reviewComment.value
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
      id: localId.value
    }),
    headers: generateHeaders()
  })
}

watch(data, async () => {
  const image = new Image()
  image.setAttribute("crossOrigin", "Anonymous")
  image.src = posterURL.value
  image.onload = () => {
    backgroundColor.value = colorThief.getColor(image)
  }
  image.onerror = () => {
    backgroundColor.value = [0, 0, 0]
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
  console.log(emoji)
  reviewComment.value += emoji.i
}
</script>

<template>
  <div
    v-if="pending || !backgroundColor"
    class="flex justify-center items-center h-96"
  >
    <Spinner color="#000" />
  </div>
  <div v-else>
    <ModalView :show="reviewModal" @close="reviewModal = false" title="Review">
      <template v-slot:body>
        <div class="space-y-4">
          <div>
            <p class="font-semibold text-lg flex items-center gap-2">
              Your Rating:
              <input
                class="w-11 h-6 p-0 text-center focus:outline-none focus:ring-0 dark:bg-zinc-700 rounded"
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
            <div class="flex justify-between mb-2 items-center relative">
              <p class="font-semibold text-lg select-none">Comment</p>
              <button
                @click="isEmojiSelector = !isEmojiSelector"
                class="text-2xl"
              >
                <span
                  class="select-none hover:bg-gray-50 dark:hover:bg-zinc-800 p-1"
                  >😀</span
                >
              </button>
              <Transition name="fade">
                <EmojiPicker
                  v-show="isEmojiSelector"
                  ref="emojiPicker"
                  class="absolute z-20 right-0"
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
                class="w-full rounded border-gray-400 dark:border-zinc-800 dark:bg-zinc-800 h-32 resize-none select-none"
              />
              <div
                class="text-gray-500 dark:text-gray-300 text-sm absolute z-10 bottom-0 right-0 m-4"
              >
                {{ reviewComment?.length || 0 }} / 512
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          @click="submitReview"
          class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors font-semibold text-white"
        >
          Submit Review
        </button>
      </template>
    </ModalView>
    <div
      class="h-[780px] w-full bg-cover bg-no-repeat bg-center relative"
      :style="{
        'background-image': `url(${backgroundURL})`
      }"
    >
      <div v-if="feature" class="absolute bottom-0 right-0 m-4">
        <HomeRandomMovie :collapsed="true" />
      </div>
      <div
        class="w-full h-full"
        :style="{
          'background-color': `rgba(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]}, 0.75)`
        }"
      >
        <div class="w-full h-full flex px-32">
          <div class="flex items-center gap-16 drop-shadow-2xl">
            <div class="relative flex-shrink-0">
              <img
                class="w-72 h-auto object-cover object-center rounded"
                draggable="false"
                :src="posterURL"
              />

              <div
                class="flex items-center text-xl justify-center gap-2 mt-2 font-maven font-semibold"
                v-if="masterRating > 0"
              >
                <div class="relative">
                  <IconsStarFilled
                    class="w-10 h-10 text-yellow-400 drop-shadow-lg"
                  />
                </div>
                <span
                  class="mt-1 drop-shadow-lg"
                  :class="{
                    'text-black': backgroundBright,
                    'text-white': !backgroundBright
                  }"
                  >{{ masterRating.toFixed(1) }}</span
                >
              </div>
            </div>
            <div class="max-w-2xl">
              <div class="flex flex-col-reverse">
                <h1
                  class="font-semibold flex-shrink-0 inline-block leading[0.1]"
                  :class="{
                    'text-6xl': title.length < 20,
                    'text-5xl': title.length < 36,
                    'text-4xl': title.length >= 36,
                    'text-black': backgroundBright,
                    'text-white': !backgroundBright
                  }"
                >
                  {{ title }}
                </h1>
                <div
                  class="flex items-center divide-x-2"
                  :class="{
                    'divide-black/20 text-black': backgroundBright,
                    'divide-white/20 text-white/70': !backgroundBright
                  }"
                >
                  <h2 class="font-semibold text-lg ml-0.5 pr-2">
                    {{ releaseDate }}
                  </h2>
                  <h2
                    v-if="genres"
                    class="font-semibold text-lg line-clamp-1 px-2"
                  >
                    {{ genres }}
                  </h2>
                  <h2 class="font-semibold text-lg line-clamp-1 px-2">
                    {{ runtime }}
                  </h2>

                  <div class="flex gap-2 items-center px-2">
                    <h2
                      v-if="contentRating && contentRating !== 'Not Rated'"
                      class="font-semibold border text-lg line-clamp-1 px-2"
                      :class="{
                        'border-black/40': backgroundBright,
                        'border-white/40': !backgroundBright
                      }"
                    >
                      {{ contentRating }}
                    </h2>
                    <div
                      v-if="imdbLoading"
                      class="bg-white/40 animate-pulse text-black font-bold flex items-center justify-center px-2 h-6 rounded w-20"
                    >
                      <svg
                        class="animate-spin h-6 w-6 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                        ></path>
                      </svg>
                    </div>
                    <a
                      v-else-if="data.vote_average > 0 || imdbScore > 0"
                      class="bg-[#F5C518] text-black font-bold flex items-center justify-center pr-2 h-6 rounded cursor-pointer hover:bg-opacity-80 transition"
                      :href="`https://www.imdb.com/title/${data.imdb_id}`"
                      target="_blank"
                    >
                      <IconImdb class="w-auto h-7" />
                      {{ imdbScore || data.vote_average.toFixed(1) }}
                    </a>
                    <RottenTomatoes
                      v-if="data.localData?.info?.ratings?.rotten_tomatoes"
                      :score="data.localData?.info?.ratings?.rotten_tomatoes"
                    />
                  </div>
                </div>
              </div>
              <p
                class="text-xl mt-2 line-clamp-6"
                :class="{
                  'text-black/80': backgroundBright,
                  'text-white/80 ': !backgroundBright
                }"
              >
                {{ overview }}
              </p>
              <div class="mt-4 flex gap-2 text-lg">
                <button
                  @click="like"
                  class="bg-white text-black px-4 py-2 flex gap-1 items-center font-semibold rounded hover:bg-opacity-80 transition"
                >
                  <IconHeartFilled v-if="userLiked" class="w-6 h-6" />
                  <IconHeart v-else class="w-6 h-6" />
                  {{ userLiked ? "Liked" : "Like" }}
                </button>
                <button
                  @click="openReview"
                  class="bg-white flex gap-1 items-center text-black px-4 py-2 font-semibold rounded hover:bg-opacity-80 transition"
                >
                  <IconStarFilled v-if="userReviewed" class="w-6 h-6" />
                  <IconStar v-else class="w-6 h-6" />
                  {{ userReviewed ? "Reviewed" : "Review" }}
                </button>
                <button
                  v-if="!userAddedWatchlist"
                  @click="submitToWatchlist"
                  class="bg-transparent border border-white flex gap-1 items-center text-white px-4 py-2 font-semibold rounded hover:opacity-80 transition"
                >
                  <IconsListAdd class="w-6 h-6" />
                  Add to watchlist
                </button>
                <button
                  v-else
                  @click="submitToWatchlist"
                  class="bg-white flex gap-1 items-center text-black px-4 py-2 font-semibold rounded hover:opacity-80 transition"
                >
                  <IconsListRemove class="w-6 h-6" />
                  Remove from watchlist
                </button>
              </div>
              <div
                :class="{
                  'text-black/80 divide-black/20': backgroundBright,
                  'text-white/80 divide-white/20': !backgroundBright
                }"
                class="mt-2 flex gap-2 divide-x-2 text-sm"
              >
                <p>{{ likes }} likes</p>
                <p class="pl-2">{{ reviews }} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container m-auto mt-8 mb-28">
      <div class="flex justify-center" v-if="reviewDataFromServer.loading">
        <Spinner color="#000" />
      </div>
      <div v-else-if="comments.length > 0">
        <h1
          class="text-2xl font-semibold border-b pb-4 my-4 dark:border-zinc-900"
        >
          Latest Reviews
        </h1>
        <div class="space-y-4">
          <div
            v-for="(comment, i) in comments"
            :key="i"
            class="flex bg-white dark:bg-zinc-900 rounded p-4 shadow items-start"
          >
            <Avatar
              :username="comment.author.username"
              class="w-16 h-16 flex-shrink-0"
            />
            <div class="flex flex-col ml-4">
              <div class="flex items-center gap-2">
                <router-link
                  :to="`/users/@${
                    comment.author._id == user?._id
                      ? 'me'
                      : comment.author.username
                  }`"
                  class="font-semibold text-lg hover:underline"
                >
                  @{{ comment.author.username }}
                </router-link>
                <p class="flex items-center gap-1">
                  <IconStarFilled class="w-4 h-4 text-yellow-400" />
                  <span class="text-sm font-semibold">{{
                    comment.rating
                  }}</span>
                </p>
                <p class="text-base text-gray-500 dark:text-gray-400">
                  {{ $moment(comment.createdAt).fromNow() }}
                  {{
                    comment.createdAt === comment.updatedAt ? "" : "(edited)"
                  }}
                </p>
              </div>

              <p
                class="text-base truncate break-all whitespace-normal"
                :class="{
                  'text-gray-500 dark:text-gray-300': !comment.content
                }"
              >
                {{
                  comment.content
                    ? comment.content
                    : "No comment for this review."
                }}
              </p>
            </div>
            <div class="ml-auto flex gap-2 items-center">
              <button
                v-if="comment.author._id === user?._id"
                @click="deleteReview"
                class="bg-red-100 dark:bg-red-900 dark:hover:bg-red-800 text-red-500 shadow rounded font-semibold px-2 py-1 ml-auto text-xs hover:bg-red-200 transition"
              >
                <IconsTrash class="w-4 h-4" />
              </button>
              <button
                v-if="comment.author._id === user?._id"
                @click="openReview"
                class="bg-white dark:bg-zinc-800 shadow rounded font-semibold px-2 py-1 ml-auto text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
              >
                <IconsPencil class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="showDetailsDev = !showDetailsDev"
        class="mt-8 bg-white dark:bg-zinc-900 shadow rounded font-semibod px-4 py-2"
      >
        {{ showDetailsDev ? "Hide" : "Show" }} details
      </button>
      <div v-if="showDetailsDev">
        <p>Movie {{ params.id }}</p>
        {{ backgroundColor }}
        <pre class="p-2 whitespace-pre-wrap bg-zinc-800 !text-orange-500">{{
          data
        }}</pre>
      </div>
    </div>
  </div>
</template>
