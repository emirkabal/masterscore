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
    <div class="aspect-video h-full w-full">
      <CorePlayer v-bind="data" class="!h-full !w-full rounded-xl" />
    </div>
  </ScreenModal>
</template>
