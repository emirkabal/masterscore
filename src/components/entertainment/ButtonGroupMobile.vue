<script lang="ts" setup>
import { useUserStore } from "~/store/user"

const { $listen } = useNuxtApp()
const hidden = ref(false)
const userStore = useUserStore()

defineProps<{
  id: string
  teaser?: string
}>()

defineEmits(["watchTrailer"])

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
      <Icon name="material-symbols:play-arrow-rounded" class="h-7 w-7 text-gray-200" />
      <span class="line-clamp-1 text-[10px] font-semibold tracking-tighter text-gray-300">
        {{ $t("entertainment.watch_trailer") }}
      </span>
    </button>
    <button
      @click="() => $event('entertainment:handle:button', 'review')"
      class="flex w-16 flex-col items-center justify-center"
    >
      <Icon
        v-if="userStore.isReviewed(id)"
        name="material-symbols:star-rounded"
        class="h-7 w-7 text-gray-200"
      />
      <Icon v-else name="material-symbols:star-outline-rounded" class="h-7 w-7 text-gray-200" />
      <span class="line-clamp-1 text-[10px] font-semibold tracking-tighter text-gray-300">
        {{
          userStore.isReviewed(id)
            ? $t("entertainment.buttons.reviewed")
            : $t("entertainment.buttons.review")
        }}
      </span>
    </button>
    <button
      @click="() => $event('entertainment:handle:button', 'like')"
      class="flex w-16 flex-col items-center justify-center"
    >
      <Icon
        v-if="userStore.isLiked(id)"
        name="material-symbols:favorite-rounded"
        class="h-7 w-7 text-gray-200"
      />
      <Icon v-else name="material-symbols:favorite-outline-rounded" class="h-7 w-7 text-gray-200" />
      <span class="line-clamp-1 text-[10px] font-semibold tracking-tighter text-gray-300">
        {{
          userStore.isLiked(id)
            ? $t("entertainment.buttons.liked")
            : $t("entertainment.buttons.like")
        }}
      </span>
    </button>
    <!-- <button
      @click="() => $event('entertainment:handle:button', 'watchlist')"
      class="flex w-16 flex-col items-center justify-center"
    >
      <Icon v-if="!inWatchlist" name="ic:round-bookmark-border" class="h-7 w-7 text-gray-200" />
      <Icon v-else name="ic:round-bookmark-remove" class="h-7 w-7 text-gray-200" />
      <span class="line-clamp-1 text-[10px] font-semibold tracking-tighter text-gray-300">
        {{ inWatchlist ? $t("entertainment.buttons.remove") : $t("entertainment.buttons.save") }}
      </span>
    </button> -->
  </div>
</template>
