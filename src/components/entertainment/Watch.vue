<script setup lang="ts">
import type { HistoryItem } from "~/types"

defineProps<{
  watchModal: boolean
  data: {
    title: string
    poster: string
    backdrop: string
    tmdbId: number
    imdbId?: string
    type: string
    playlistId: number
    series?: {
      episode: number
      season: number
    }
  }
}>()

const emits = defineEmits(["close"])

const close = () => {
  emits("close")
}
</script>

<template>
  <ScreenModal v-if="data.playlistId" :modal="watchModal" @close="close">
    <CorePlayer
      v-bind="data"
      class="h-[195px] w-[350px] rounded-xl lg:aspect-video lg:h-auto lg:w-full"
    />
  </ScreenModal>
</template>
