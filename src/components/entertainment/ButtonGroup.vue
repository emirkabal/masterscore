<script setup lang="ts">
import type { ReviewData, TMDBData } from "~/types"
import { useUserStore } from "~/store/user"
import type { ApplicationEvents } from "~/plugins/event-bus"
const { $event, $listen, $dispatch } = useNuxtApp()
const { user, isLoggedIn } = useUserStore()
const cooldown = ref(false)
const props = defineProps<{
  data?: TMDBData
  reviewData?: ReviewData
  loading?: boolean
  smartVideoData?: any
}>()

const emits = defineEmits(["openReview"])

const likes = ref(0)

const userLiked = computed(() => {
  return props.data && user?.likes?.includes(props.data.localId)
})
const userReviewed = computed(() => {
  return props.data && user?.reviews?.includes(props.data.localId)
})
const userAddedWatchlist = computed(() => {
  return props.data && user?.watchlist?.includes(props.data.localId)
})

const like = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }
  if (cooldown.value) return
  if (props.data && user?.likes && user.likes.includes(props.data.localId)) {
    user.likes = user.likes.filter((e) => e !== props.data?.localId)
  } else if (props.data && user?.likes) {
    user.likes.push(props.data.localId)
  }
  if (!props.data) return
  cooldown.value = true
  const { likes: entertainmentLikes } = await $fetch<{
    likes: number
  }>(`/api/likes`, {
    method: "POST",
    body: JSON.stringify({
      id: props.data.localId,
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
  if (props.data && user?.watchlist && user.watchlist.includes(props.data.localId)) {
    user.watchlist = user.watchlist.filter((e) => e !== props.data?.localId)
  } else if (props.data && user?.watchlist) {
    user.watchlist.push(props.data.localId)
  }
  if (!props.data) return
  await $fetch("/api/users/me/watchlist", {
    method: "POST",
    body: JSON.stringify({
      id: props.data.localId,
      type: userAddedWatchlist.value ? "add" : "remove"
    }),
    headers: generateHeaders()
  })
}

const fetchLikes = async () => {
  if (!props.data) return
  const { likes: entertainmentLikes } = await $fetch<{
    likes: number
  }>(`/api/likes/${props.data.localId}`)
  likes.value = entertainmentLikes
}
const watchSmartVideo = (id: any) => {
  $event("entertainment:watch", id)
}

watchEffect(() => {
  if (props.data) fetchLikes()
})

const handleEvents = (val: ApplicationEvents["entertainment:handle:button"]) => {
  if (val[0] === "watch") {
    watchSmartVideo(val[1])
  } else if (val === "review") {
    emits("openReview")
  } else if (val === "like") {
    like()
  } else if (val === "watchlist") {
    submitToWatchlist()
  }
}

onMounted(() => {
  $listen("entertainment:handle:button", handleEvents)
})

onUnmounted(() => {
  $dispatch("entertainment:handle:button", handleEvents)
})
</script>

<template>
  <div v-if="loading">
    <div class="flex flex-row gap-2">
      <div class="skeleton-effect h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-800"></div>
      <div class="skeleton-effect h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-800"></div>
      <div class="skeleton-effect h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-800"></div>
    </div>
  </div>
  <div v-else-if="!loading && data && reviewData" class="mb-4 hidden gap-2 text-lg lg:flex">
    <button
      v-if="smartVideoData?.id"
      @click="watchSmartVideo(smartVideoData.id)"
      v-tooltip="{
        content: $t('entertainment.buttons.watch')
      }"
      class="btn"
    >
      <Icon name="ic:round-play-arrow" class="h-7 w-7" />
    </button>
    <button
      @click="$emit('openReview')"
      class="btn"
      :class="{
        active: userReviewed
      }"
      v-tooltip="{
        content: userReviewed
          ? $t('entertainment.buttons.reviewed')
          : $t('entertainment.buttons.review')
      }"
    >
      <Icon name="ic:round-star" class="h-7 w-7" />
    </button>
    <button
      @click="like"
      class="btn"
      :class="{
        active: userLiked
      }"
      v-tooltip="{
        content: userLiked ? $t('entertainment.buttons.liked') : $t('entertainment.buttons.like')
      }"
    >
      <Icon name="ic:round-favorite" class="h-7 w-7" />
    </button>
    <button
      @click="submitToWatchlist"
      class="btn"
      :class="{
        active: userAddedWatchlist
      }"
      v-tooltip="{
        content: userAddedWatchlist
          ? $t('entertainment.buttons.remove_from_watchlist')
          : $t('entertainment.buttons.add_to_watchlist')
      }"
    >
      <Icon name="ic:round-bookmark-add" v-if="!userAddedWatchlist" class="h-7 w-7" />
      <Icon name="ic:round-bookmark-remove" v-else class="h-7 w-7" />
    </button>
  </div>
</template>

<style>
.btn {
  @apply flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white p-2 transition-colors hover:bg-white hover:text-black;
}

.btn.active {
  @apply bg-white text-black;
}

.btn.active:hover {
  @apply opacity-75 transition-opacity;
}
</style>
