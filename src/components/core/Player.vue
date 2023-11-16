<template>
  <Loader v-if="pending" />
  <div v-else-if="error">SOMETING WENT WRONG</div>
  <VideoPlayer
    v-else
    :class="[
      'video-player vjs-big-play-centered aspect-video w-full overflow-hidden rounded-xl',
      { loading: !state }
    ]"
    :sources="mediaConfig.sources"
    :poster="mediaConfig.poster"
    :tracks="mediaConfig.tracks"
    :autoplay="config.autoplay"
    :playbackRates="config.playbackRates"
    :fluid="config.fluid"
    :loop="config.loop"
    crossorigin="anonymous"
    playsinline
    :height="480"
    v-model:volume="config.volume"
    v-model:playbackRate="config.playbackRate"
    v-model:controls="config.controls"
    v-model:muted="config.muted"
    :onTimeupdate="handleProgress"
    @mounted="handleMounted"
  >
  </VideoPlayer>
</template>

<script setup lang="ts">
import { VideoPlayer } from "@videojs-player/vue"
import type { HistoryItem } from "~/types"
import type { VideoPlayerProps, VideoPlayerState } from "@videojs-player/vue"
import videojs from "video.js"
import "video.js/dist/video-js.css"

// @ts-ignore
import fullscreen from "videojs-landscape-fullscreen"
videojs.registerPlugin("landscapeFullscreen", fullscreen)

import { useLocalStorage } from "@vueuse/core"

const history = useLocalStorage<HistoryItem[]>("player-history", [])
const props = defineProps<{
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
}>()

const { data, error, pending } = await useLazyFetch<
  {
    sources: {
      file: string
      type: string
    }[]
    tracks: {
      file: string
      kind: string
      language: string
      label: string
    }[]
  }[]
>(`https://videoseyred.in/playlist/${props.playlistId}.json`)

const getMediaData = () => {
  if (!data.value?.length)
    return {
      sources: [],
      tracks: []
    }
  return {
    sources:
      data.value[0].sources.map((e) => {
        return {
          src: e.file,
          type: e.type
        }
      }) ?? [],
    tracks:
      data.value[0].tracks.map((e) => {
        return {
          src: e.file,
          kind: e.kind,
          srclang: e.language,
          label: e.label
        }
      }) ?? []
  }
}

type VideoJsPlayer = ReturnType<typeof videojs>

const player = shallowRef<VideoJsPlayer>()
const state = shallowRef<VideoPlayerState>()
const mediaConfig = shallowRef<any>()
const config = shallowReactive<VideoPlayerProps>({
  autoplay: false,
  volume: 0.5,
  playbackRate: 1,
  playbackRates: [1, 2, 3],
  controls: true,
  fluid: false,
  muted: false,
  loop: false
})

watch(data, () => {
  console.log(data.value)
  if (!data.value) return
  const handledMediaData = getMediaData()
  mediaConfig.value = {
    sources: handledMediaData.sources ?? [],
    poster: props.backdrop,
    tracks: handledMediaData.tracks ?? []
  }
})

const handleProgress = (payload: any) => {
  if (!payload) return
  const currentTime = player.value?.currentTime() || 0
  const duration = player.value?.duration() || 0
  history.value = [
    ...history.value.filter((e) => e.playlistId !== props.playlistId),
    {
      playlistId: props.playlistId,
      tmdbId: props.tmdbId,
      imdbId: props.imdbId,
      type: props.type,
      title: props.title,
      backdrop: props.backdrop,
      poster: props.poster,
      currentTime,
      duration,
      series: props.series,
      playedAt: Date.now()
    }
  ]
}

const handleMounted = (payload: any) => {
  payload.player.landscapeFullscreen({
    fullscreen: {
      enterOnRotate: true,
      exitOnRotate: true,
      alwaysInLandscapeMode: true,
      iOS: true
    }
  })

  state.value = payload.state
  player.value = payload.player

  const historyItem = history.value.find(
    (e) => e.playlistId === props.playlistId
  )
  if (historyItem && player.value) {
    player.value.currentTime(historyItem.currentTime)
  }
}
</script>

<style>
.video-js select {
  color: black !important;
}
</style>
