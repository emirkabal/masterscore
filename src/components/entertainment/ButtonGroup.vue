<script setup lang="ts">
import { ReviewData, TMDBData } from "~~/src/@types"
import { useUserStore } from "~/store/user"
const { user, isLoggedIn } = useUserStore()

const { data, isLight, reviewData } = defineProps<{
  data?: TMDBData
  isLight?: boolean
  reviewData?: ReviewData
  loading?: boolean
}>()

defineEmits(["openReview"])

const likes = ref(0)

const userLiked = computed(() => {
  return data && user?.likes?.includes(data.localId)
})
const userReviewed = computed(() => {
  return data && user?.reviews?.includes(data.localId)
})
const userAddedWatchlist = computed(() => {
  return data && user?.watchlist?.includes(data.localId)
})

const like = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  if (data && user?.likes && user.likes.includes(data.localId)) {
    user.likes = user.likes.filter((e) => e !== data.localId)
  } else if (data && user?.likes) {
    user.likes.push(data.localId)
  }
  if (!data) return
  const { likes: entertainmentLikes } = await $fetch<{
    likes: number
  }>(`/api/likes`, {
    method: "POST",
    body: JSON.stringify({
      id: data.localId,
      type: userLiked.value ? "add" : "remove"
    }),
    headers: generateHeaders()
  })
  likes.value = entertainmentLikes
}

const submitToWatchlist = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  if (data && user?.watchlist && user.watchlist.includes(data.localId)) {
    user.watchlist = user.watchlist.filter((e) => e !== data.localId)
  } else if (data && user?.watchlist) {
    user.watchlist.push(data.localId)
  }
  if (!data) return
  await $fetch("/api/users/me/watchlist", {
    method: "POST",
    body: JSON.stringify({
      id: data.localId,
      type: userAddedWatchlist.value ? "add" : "remove"
    }),
    headers: generateHeaders()
  })
}

const fetchLikes = async () => {
  if (!data) return
  const { likes: entertainmentLikes } = await $fetch<{
    likes: number
  }>(`/api/likes/${data.localId}`)
  likes.value = entertainmentLikes
}
onMounted(() => {
  fetchLikes()
})
</script>

<template>
  <div v-if="loading">
    <div class="mt-3 flex flex-col gap-2 lg:flex-row">
      <div
        class="skeleton-effect h-8 w-full rounded bg-gray-300 dark:bg-zinc-800 lg:w-1/4"
      ></div>
      <div
        class="skeleton-effect h-8 w-full rounded bg-gray-300 dark:bg-zinc-800 lg:w-1/4"
      ></div>
      <div
        class="skeleton-effect h-8 w-full rounded bg-gray-300 dark:bg-zinc-800 lg:w-4/12"
      ></div>
    </div>
  </div>
  <div v-else-if="!loading && data && reviewData">
    <div class="mt-4 flex flex-col gap-2 text-lg lg:flex-row">
      <button
        @click="like"
        class="flex h-10 items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:bg-opacity-80"
      >
        <IconsThumbUpFilled v-if="userLiked" class="h-6 w-6" />
        <IconsThumbUpUnfilled v-else class="h-6 w-6" />
        {{ userLiked ? "Recommended" : "Recommend" }}
      </button>
      <button
        @click="$emit('openReview')"
        class="flex h-10 items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:bg-opacity-80"
      >
        <IconsStarFilled v-if="userReviewed" class="h-6 w-6" />
        <IconsStar v-else class="h-6 w-6" />
        {{ userReviewed ? "Reviewed" : "Review" }}
      </button>
      <button
        v-if="!userAddedWatchlist"
        @click="submitToWatchlist"
        class="flex h-10 items-center gap-1 rounded border bg-transparent px-4 py-2 font-semibold transition hover:opacity-80"
        :class="{
          'border-black text-black': isLight,
          'border-white text-white': !isLight
        }"
      >
        <IconsListAdd class="h-6 w-6" />
        Add to watchlist
      </button>
      <button
        v-else
        @click="submitToWatchlist"
        class="flex h-10 items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:opacity-80"
      >
        <IconsListRemove class="h-6 w-6" />
        Remove from watchlist
      </button>
    </div>
    <div
      :class="{
        'divide-black/20 text-black/80': isLight,
        'divide-white/20 text-white/80': !isLight
      }"
      class="mt-2 flex gap-2 divide-x-2 text-sm"
    >
      <p>
        {{ likes }}
        {{ likes <= 1 ? "person" : "people" }} recommended
      </p>
      <p class="pl-2">{{ reviewData.count }} reviews</p>
    </div>
  </div>
</template>
