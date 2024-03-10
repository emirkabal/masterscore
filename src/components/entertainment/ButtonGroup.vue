<script setup lang="ts">
import type { CollapsedMedia } from "~/types"
import { useUserStore } from "~/store/user"
const userStore = useUserStore()

const props = defineProps<{
  data?: CollapsedMedia
  teaser?: string
  loading?: boolean
}>()

const emits = defineEmits(["openReview", "watchTrailer"])

// onMounted(() => {
//   $listen("entertainment:handle:button", handleEvents)
// })

// onUnmounted(() => {
//   $dispatch("entertainment:handle:button", handleEvents)
// })
</script>

<template>
  <div v-if="loading">
    <div class="flex flex-row gap-2">
      <div class="skeleton-effect h-10 w-10 rounded-full bg-gray-800"></div>
      <div class="skeleton-effect h-10 w-10 rounded-full bg-gray-800"></div>
      <div class="skeleton-effect h-10 w-10 rounded-full bg-gray-800"></div>
    </div>
  </div>
  <div v-else-if="!loading && data" class="mb-4 hidden gap-2 text-lg lg:flex">
    <button
      :disabled="userStore.isLoading"
      type="button"
      @click="likeMedia(data.media.id)"
      class="btn"
      :class="{
        active: userStore.isLiked(data.media.id)
      }"
      v-tooltip="{
        content: userStore.isLiked(data.media.id)
          ? $t('entertainment.buttons.unlike')
          : $t('entertainment.buttons.like')
      }"
    >
      <Icon name="ic:round-favorite" class="h-7 w-7" />
    </button>
    <button
      class="btn"
      v-tooltip="{
        content: true
          ? $t('entertainment.buttons.remove_from_watchlist')
          : $t('entertainment.buttons.add_to_watchlist')
      }"
    >
      <Icon name="ic:round-bookmark-add" v-if="!true" class="h-7 w-7" />
      <Icon name="ic:round-bookmark-remove" v-else class="h-7 w-7" />
    </button>

    <button
      v-if="teaser"
      @click="$emit('watchTrailer')"
      class="flex items-center gap-x-1 px-2 font-semibold transition-opacity hover:opacity-75"
    >
      <Icon name="ic:round-play-arrow" class="h-7 w-7" />
      {{ $t("entertainment.watch_trailer") }}
    </button>
  </div>
</template>

<style>
.btn {
  @apply flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white p-2 transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-white disabled:text-black disabled:opacity-30;
}

.btn.active {
  @apply bg-white text-black;
}

.btn.active:hover {
  @apply opacity-75 transition-opacity;
}
</style>
