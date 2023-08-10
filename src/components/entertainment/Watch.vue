<script setup lang="ts">
const props = defineProps<{
  smartVideoData?: any
  smartVideoPending?: boolean
  smartVideoId?: string | number
  watchModal: boolean
}>()

const watchIframe = ref<HTMLIFrameElement | null>(null)
const iframeLoading = ref(true)

const emits = defineEmits(["close"])

const close = () => {
  iframeLoading.value = true
  emits("close")
}
</script>

<template>
  <ScreenModal v-if="smartVideoData" :modal="watchModal" @close="close">
    <Spinner v-show="iframeLoading" class="h-screen max-h-[648px]" />
    <iframe
      ref="watchIframe"
      v-show="!iframeLoading"
      :src="'https://videoseyred.in/embed/' + smartVideoId"
      frameborder="0"
      width="1920"
      height="1080"
      class="aspect-video h-auto max-h-[648px] w-full rounded-xl"
      title="Watch Feature"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      @load="iframeLoading = false"
    ></iframe>
  </ScreenModal>
</template>
