<script lang="ts" setup>
import { useUserStore } from "~/store/user"

const { $listen } = useNuxtApp()
const hidden = ref(false)
const { user } = useUserStore()

const props = defineProps<{
  id: string
  teaser?: string
}>()

defineEmits(["watchTrailer"])

const isLiked = computed(() => {
  return user?.likes?.includes(props.id)
})
const isReviewed = computed(() => {
  return user?.reviews?.includes(props.id)
})
const inWatchlist = computed(() => {
  return user?.watchlist?.includes(props.id)
})

$listen("modal:trailer", (val) => {
  hidden.value = val
})
</script>

<template>
  <div
    class="fixed bottom-0 left-0 z-20 flex w-full items-center justify-between bg-gray-900 px-4 py-2 lg:hidden"
    :class="{
      hidden: hidden
    }"
  >
    <button
      v-if="teaser"
      @click="$emit('watchTrailer')"
      class="flex w-16 flex-col items-center justify-center"
    >
      <Icon name="ic:round-play-arrow" class="h-7 w-7 text-gray-200" />
      <span class="line-clamp-1 text-[10px] font-semibold tracking-tighter text-gray-300">
        {{ $t("entertainment.watch_trailer") }}
      </span>
    </button>
    <button
      @click="() => $event('entertainment:handle:button', 'review')"
      class="flex w-16 flex-col items-center justify-center"
    >
      <Icon v-if="isReviewed" name="ic:round-star" class="h-7 w-7 text-gray-200" />
      <Icon v-else name="ic:round-star-outline" class="h-7 w-7 text-gray-200" />
      <span class="line-clamp-1 text-[10px] font-semibold tracking-tighter text-gray-300">
        {{ isReviewed ? $t("entertainment.buttons.reviewed") : $t("entertainment.buttons.review") }}
      </span>
    </button>
    <button
      @click="() => $event('entertainment:handle:button', 'like')"
      class="flex w-16 flex-col items-center justify-center"
    >
      <Icon v-if="isLiked" name="ic:round-favorite" class="h-7 w-7 text-gray-200" />
      <Icon v-else name="ic:round-favorite-border" class="h-7 w-7 text-gray-200" />
      <span class="line-clamp-1 text-[10px] font-semibold tracking-tighter text-gray-300">
        {{ isLiked ? $t("entertainment.buttons.liked") : $t("entertainment.buttons.like") }}
      </span>
    </button>
    <button
      @click="() => $event('entertainment:handle:button', 'watchlist')"
      class="flex w-16 flex-col items-center justify-center"
    >
      <Icon v-if="!inWatchlist" name="ic:round-bookmark-border" class="h-7 w-7 text-gray-200" />
      <Icon v-else name="ic:round-bookmark-remove" class="h-7 w-7 text-gray-200" />
      <span class="line-clamp-1 text-[10px] font-semibold tracking-tighter text-gray-300">
        {{ inWatchlist ? $t("entertainment.buttons.remove") : $t("entertainment.buttons.save") }}
      </span>
    </button>
  </div>
</template>
