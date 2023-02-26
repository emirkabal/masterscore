<script lang="ts" setup>
import { useUserStore } from "~/store/user"
import { IReview, IUser } from "~/@types"
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

if (params.id === localUser?.username) {
  useRouter().push("/users/@me/reviews")
}

const fetchReviews = async () => {
  reviews.loading = true
  const data = await $fetch(`/api/users/${user.value?._id}/reviews`, {
    headers: generateHeaders()
  })
  reviews.loading = false
  if ("status" in data) {
    return
  }
  reviews.items = data
}

if (params.id === "me") {
  loading.value = false
  user.value = localUser
  fetchReviews()
} else {
  onMounted(async () => {
    const data = await $fetch(`/api/users/${params.id}`)
    loading.value = false
    if ("status" in data) {
      error.value = data.message
    } else {
      user.value = data
      fetchReviews()
    }
  })
}
</script>

<template>
  <div v-if="loading" class="flex justify-center mt-48">
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
      :is-me="user.username === localUser?.username"
      :viewProfile="true"
    />
    <div class="container px-4 mx-auto 2xl:mt-10 mt-16">
      <div
        class="flex items-center justify-between border-b dark:border-zinc-900 p-2 md:p-6 mb-8"
      >
        <h1 class="font-bold text-lg md:text-2xl">
          @{{ user.username }}'s reviews
        </h1>
      </div>
      <div v-if="reviews.loading" class="flex justify-center mt-12">
        <Spinner color="#000" />
      </div>
      <div
        v-else-if="reviews.items.length === 0"
        class="flex justify-center mt-12"
      >
        <p class="text-gray-500 dark:text-gray-200">No reviews found</p>
      </div>
      <div class="flex flex-col gap-2 mb-10" v-else>
        <div v-for="review in reviews.items" :key="review._id">
          <div
            class="bg-white dark:bg-zinc-900 rounded shadow flex overflow-hidden"
          >
            <img
              :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${review.entertainment.info.poster}`"
              class="h-24 w-auto"
            />
            <div class="p-4">
              <div class="flex items-center gap-2">
                <router-link
                  :to="`/details/${review.entertainment.type}/${review.entertainment.id}`"
                  class="font-semibold hover:underline"
                >
                  {{ review.entertainment.info.title }}
                </router-link>
                <p class="flex items-center gap-1">
                  <IconsStarFilled class="w-4 h-4 text-yellow-400" />
                  <span class="text-sm font-semibold">{{ review.rating }}</span>
                </p>
                <p class="text-base text-gray-500 dark:text-gray-400">
                  {{ $moment(review.createdAt).fromNow() }}
                  {{ review.createdAt === review.updatedAt ? "" : "(edited)" }}
                </p>
              </div>

              <p
                class="text-base truncate break-all whitespace-normal"
                :class="{
                  'text-gray-500 dark:text-gray-300': !review.content
                }"
              >
                {{
                  review.content
                    ? review.content
                    : "No comment for this review."
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
