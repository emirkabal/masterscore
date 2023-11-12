<script setup lang="ts">
const props = defineProps<{
  watchModal: boolean
  data: {
    title: string
    poster: string
    backdrop: string
    tmdbId: string
    imdbId?: string
    type: string
    playlistId: string
    series?: any
  }
}>()

const emits = defineEmits(["close"])

const close = () => {
  emits("close")
}
</script>

<template>
  <ScreenModal v-if="data.playlistId" :modal="watchModal" @close="close">
    <CorePlayer v-bind="data" class="aspect-video overflow-hidden rounded-xl" />
  </ScreenModal>
</template>
