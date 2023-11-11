<script setup lang="ts">
import type { ReviewData, TMDBData } from "~/types"
import { useUserStore } from "~/store/user"
const { $event } = useNuxtApp()
const { user, isLoggedIn } = useUserStore()
const cooldown = ref(false)
const { data, isLight, reviewData, smartVideoData } = defineProps<{
  data?: TMDBData
  isLight?: boolean
  reviewData?: ReviewData
  loading?: boolean
  smartVideoData?: any
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
  if (cooldown.value) return
  if (data && user?.likes && user.likes.includes(data.localId)) {
    user.likes = user.likes.filter((e) => e !== data.localId)
  } else if (data && user?.likes) {
    user.likes.push(data.localId)
  }
  if (!data) return
  cooldown.value = true
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
  setTimeout(() => {
    cooldown.value = false
  }, 1000)
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

const watchSmartVideo = (id: any) => {
  $event("entertainment:watch", id)
}

watchEffect(() => {
  if (data) {
    fetchLikes()
  }
})
</script>

<template>
  <div v-if="loading">
    <div class="mt-4 flex flex-col gap-2 lg:flex-row">
      <div
        class="skeleton-effect h-10 w-full rounded bg-gray-300 dark:bg-zinc-800 lg:w-1/4"
      ></div>
      <div
        class="skeleton-effect h-10 w-full rounded bg-gray-300 dark:bg-zinc-800 lg:w-1/4"
      ></div>
      <div
        class="skeleton-effect h-10 w-full rounded bg-gray-300 dark:bg-zinc-800 lg:w-4/12"
      ></div>
    </div>
    <div class="mt-3 flex flex-row gap-2">
      <div
        class="skeleton-effect h-3 w-3/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800"
      ></div>
      <div
        class="skeleton-effect h-3 w-3/12 rounded bg-gray-300 pr-2 font-semibold dark:bg-zinc-800"
      ></div>
    </div>
  </div>
  <div v-else-if="!loading && data && reviewData">
    <div
      class="mt-4 flex flex-col gap-2 text-lg lg:flex-row"
      :class="{
        'flex flex-wrap': smartVideoData?.id
      }"
    >
      <div
        class="grid gap-2 lg:flex"
        :class="{
          'sm:grid-cols-2': smartVideoData?.id
        }"
      >
        <button
          v-if="smartVideoData?.id"
          @click="watchSmartVideo(smartVideoData.id)"
          class="flex h-10 items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:bg-opacity-80"
        >
          <Icon name="ic:outline-play-arrow" class="h-7 w-7" />
          {{ $t("entertainment.buttons.watch") }}
        </button>

        <button
          @click="$emit('openReview')"
          class="flex h-10 items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:bg-opacity-80"
        >
          <Icon name="ic:round-star" v-if="userReviewed" class="h-7 w-7" />
          <Icon name="ic:round-star-border" v-else class="h-7 w-7" />
          {{
            userReviewed
              ? $t("entertainment.buttons.reviewed")
              : $t("entertainment.buttons.review")
          }}
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="!userAddedWatchlist"
          @click="submitToWatchlist"
          class="flex h-10 flex-grow items-center gap-1 rounded border bg-transparent px-4 py-2 font-semibold leading-4 transition hover:opacity-80"
          :class="{
            'border-black text-black': isLight,
            'border-white text-white': !isLight
          }"
        >
          <Icon name="ic:outline-playlist-add" class="h-7 w-7" />
          {{ $t("entertainment.buttons.add_to_watchlist") }}
        </button>
        <button
          v-else
          @click="submitToWatchlist"
          class="flex h-10 flex-shrink-0 flex-grow items-center gap-1 rounded bg-white px-4 py-2 font-semibold text-black transition hover:opacity-80"
        >
          <Icon name="ic:outline-playlist-remove" class="h-7 w-7" />
          {{ $t("entertainment.buttons.remove_from_watchlist") }}
        </button>
        <button
          @click="like"
          class="flex h-10 items-center gap-1 font-semibold text-white hover:bg-opacity-80"
        >
          <Like :liked="userLiked" />
        </button>
      </div>
    </div>
    <div
      :class="{
        'divide-black/20 text-black/80': isLight,
        'divide-white/20 text-white/80': !isLight
      }"
      class="mt-2 flex gap-2 divide-x-2 text-sm"
    >
      <p>{{ likes }} {{ $t("entertainment.summary.likes") }}</p>
      <p class="pl-2">
        {{ reviewData.count }} {{ $t("entertainment.summary.reviews") }}
      </p>
    </div>
  </div>
</template>
