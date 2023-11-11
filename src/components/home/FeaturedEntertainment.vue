<script setup lang="ts">
import type { TMDBSearchResult } from "~/types"
const { isDesktop } = useDevice()

const { data } = defineProps<{
  data: TMDBSearchResult & {
    backdrop_path: string
    logo_path: string
    video: {
      key: string
    }
  }
}>()

const videoLoaded = ref(false)
const iframeLoaded = ref(false)
const videoEnded = ref(false)
const muted = ref(true)
const player = ref()

const replay = () => {
  if (player.value && player.value.contentWindow) {
    player.value.contentWindow.postMessage(
      `{"event":"command","func":"seekTo","args":[2,true]}`,
      "*"
    )
    player.value.contentWindow.postMessage(
      `{"event":"command","func":"playVideo","args":[true]}`,
      "*"
    )
    videoEnded.value = false
  }
}

const setMute = (bool: boolean) => {
  if (player.value && player.value.contentWindow) {
    if (bool) {
      muted.value = true
      player.value.contentWindow.postMessage(
        `{"event":"command","func":"mute","args":[true,true]}`,
        "*"
      )
    } else {
      muted.value = false
      player.value.contentWindow.postMessage(
        `{"event":"command","func":"unMute","args":[true,true]}`,
        "*"
      )
    }
  }
}

if (process.client && isDesktop) {
  window.addEventListener("message", function (msg) {
    try {
      const data = JSON.parse(msg.data)

      if (data.event === "onReady") {
        player.value.contentWindow.postMessage(
          '{"event":"command","func":"seekTo","args":[2,true]}',
          "*"
        )
        player.value.contentWindow.postMessage(
          '{"event":"command","func":"setVolume","args":[0.5,true]}',
          "*"
        )
      } else if (data.event === "infoDelivery") {
        if (data.info?.playbackRate === 1 && !data.info?.playerState) {
          videoLoaded.value = true
        }

        if (data.info.currentTime && data.info.duration) {
          if (data.info.currentTime >= data.info.duration - 5) {
            videoEnded.value = true
          }
        }
      }
    } catch (error) {}
  })
}
watch(iframeLoaded, () => {
  if (player.value && player.value.contentWindow) {
    player.value.contentWindow.postMessage(
      '{"event":"listening","id":1,"channel":"widget"}',
      "*"
    )
  }
})
</script>
<template>
  <section
    class="relative flex h-[90vh] w-full items-center overflow-hidden bg-black"
  >
    <NuxtImg
      class="absolute inset-0 h-full w-full select-none object-cover brightness-50 filter md:brightness-75"
      :src="$timage(data.backdrop_path, 'original')"
      draggable="false"
      loading="lazy"
      :alt="data.name"
    />

    <ClientOnly>
      <iframe
        v-if="isDesktop"
        ref="player"
        id="player"
        class="pointer-events-none absolute inset-0 hidden h-full w-full scale-150 select-none lg:block"
        :class="{ 'opacity-0': !iframeLoaded || !videoLoaded || videoEnded }"
        :src="`https://www.youtube.com/embed/${data.video.key}?enablejsapi=1&widgetid=1&controls=0&autoplay=1&mute=1&disablekb=1&fs=1&cc_load_policy=1&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&loop=1`"
        frameborder="0"
        @load="iframeLoaded = true"
        seamless
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allow="autoplay; fullscreen; picture-in-picture"
      ></iframe>
    </ClientOnly>
    <button
      v-if="iframeLoaded && videoLoaded && !videoEnded"
      class="absolute bottom-0 right-0 z-10 mb-12 mr-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-xl transition-colors hover:bg-white/20"
      @click="setMute(!muted)"
    >
      <IconsVolumeX v-if="muted" />
      <IconsVolume v-else />
    </button>
    <a
      v-if="iframeLoaded && videoLoaded && !videoEnded"
      :href="`https://youtu.be/${data.video.key}`"
      rel="noopener noreferrer nofollow"
      target="_blank"
      class="absolute bottom-0 right-0 z-10 m-4 text-xs text-white opacity-50 transition-opacity hover:opacity-90"
      >provided by YouTube</a
    >

    <div class="container z-10 mx-auto w-full px-4">
      <div
        class="flex max-w-xl flex-col items-center text-center md:items-start md:text-left"
      >
        <MasterImage
          class="mb-8 w-3/4 select-none bg-transparent drop-shadow"
          :alt="`${data.title || data.name || 'Untitled'} Logo`"
          :source="$timage(data.logo_path, 'w500')"
        />
        <p class="text-shadow line-clamp-3 text-lg font-medium text-white">
          {{ data.overview }}
        </p>
        <div class="mt-2 flex flex-col gap-2 md:flex-row">
          <button
            v-if="!videoLoaded || videoEnded"
            @click="replay"
            class="hidden h-12 w-full items-center gap-4 rounded bg-white px-4 py-2 text-xl font-bold text-black shadow-xl transition-colors hover:bg-white/90 lg:flex lg:w-fit"
          >
            <IconsPlay class="h-8 w-8" />
            Play Trailer
          </button>
          <NuxtLink
            :to="`/details/movie/${data.id}`"
            class="inset-0 flex h-12 w-full items-center gap-4 rounded bg-white/10 px-4 py-2 text-xl font-bold text-white shadow-xl backdrop-blur transition-colors hover:bg-white/20 md:w-fit"
          >
            <IconsInfo class="h-8 w-8" />
            Get more details
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
