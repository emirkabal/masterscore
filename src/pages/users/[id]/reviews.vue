<script lang="ts" setup>
import { useUserStore } from "~/store/user"
import { ErrorResponse, IReview, IUser } from "~/@types"
const { params } = useRoute()

definePageMeta({
  middleware: ["auth"]
})

const screenWidth = ref(768)
onMounted(() => {
  screenWidth.value = window.innerWidth
})
const { user: localUser } = useUserStore()
const loading = ref(true)
const reviews = reactive({
  loading: true,
  items: [] as IReview[]
})
const error = ref("")
const user = ref<Omit<IUser, "password"> | undefined>(undefined)

if (params.id.toString().startsWith("@")) {
  params.id = params.id.toString().slice(1)
}

// if (params.id === localUser?.username) {
//   useRouter().push("/users/@me/reviews")
// }

const fetchReviews = async () => {
  reviews.loading = true
  const data = await $fetch(`/api/users/${user.value?._id}/reviews`, {
    headers: generateHeaders()
  })
  reviews.loading = false
  if ("status" in data) {
    return
  }
  reviews.items = data as unknown as IReview[]
}

if (params.id === "me") {
  loading.value = false
  user.value = localUser
  fetchReviews()
  if (user.value) {
    useHead({
      title: `@${user.value.username}'s reviews`,
      titleTemplate: "%s - Masterscore"
    })
  }
} else {
  onMounted(async () => {
    const data = await $fetch(`/api/users/${params.id}`)
    loading.value = false
    if ("status" in data) {
      error.value = data.message
    } else {
      user.value = data as unknown as Omit<IUser, "password">
      fetchReviews()
      useHead({
        title: `@${user.value.username}'s reviews`,
        titleTemplate: "%s - Masterscore"
      })
    }
  })
}
</script>

<template>
  <div v-if="loading" class="mt-48 flex justify-center">
    <Spinner color="#000" />
  </div>
  <div v-else-if="error.length > 0 || !user">
    <h1 class="text-2xl font-bold">Error</h1>
    <p class="text-gray-500">{{ error }}</p>
  </div>
  <div v-else>
    <ProfileBanner
      :banner="user?.banner || ''"
      :username="user.username"
      :avatar="user.avatar"
      :is-me="user.username === localUser?.username"
      :viewProfile="true"
    />
    <div
      class="container mx-auto my-24 space-y-12 px-4 lg:px-40 xl:px-72 2xl:px-96"
    >
      <div
        class="mb-8 flex items-center justify-between border-b p-2 dark:border-zinc-900 md:p-6"
      >
        <h1 class="text-lg font-bold md:text-2xl">
          @{{ user.username }}'s reviews
        </h1>
      </div>
      <div v-if="reviews.loading" class="mt-12 flex justify-center">
        <Spinner color="#000" />
      </div>
      <div
        v-else-if="reviews.items.length === 0"
        class="mt-12 flex justify-center"
      >
        <p class="text-gray-500 dark:text-gray-200">No reviews found</p>
      </div>
      <div class="mb-10 flex flex-col gap-6" v-else>
        <div v-for="review in reviews.items" :key="review._id">
          <div class="flex items-start overflow-hidden rounded p-4">
            <img
              :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${review.entertainment.info.poster}`"
              class="mr-4 h-24 w-auto rounded-lg"
              draggable="false"
            />
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/details/${review.entertainment.type}/${review.entertainment.id}`"
                  class="font-semibold hover:underline"
                >
                  {{ review.entertainment.info.title }}
                </NuxtLink>
                <p
                  class="flex-shrink-0 text-base text-gray-500 dark:text-gray-400"
                >
                  {{ $moment(review.createdAt).fromNow() }}
                </p>
              </div>
              <span class="text-sm opacity-90">
                Reviewed: {{ review.rating }}/10
              </span>
              <ReviewContent :review="review" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
