<template>
  <Loader v-if="pending" />
  <div v-else-if="error">SOMETHING WENT WRONG</div>
  <VideoPlayer
    v-else
    class="video-js vjs-big-play-centered h-full w-full overflow-hidden rounded-xl"
    :class="{
      loading: !state,
      '!rounded-none': disableRounded
    }"
    :sources="mediaConfig.sources"
    :poster="mediaConfig.poster"
    :tracks="mediaConfig.tracks"
    :autoplay="config.autoplay"
    :playbackRates="config.playbackRates"
    :fluid="config.fluid"
    :loop="config.loop"
    playsinline
    v-model:volume="config.volume"
    v-model:playbackRate="config.playbackRate"
    v-model:controls="config.controls"
    v-model:muted="config.muted"
    :onTimeupdate="handleProgress"
    @mounted="handleMounted"
  />
</template>

<script setup lang="ts">
import { VideoPlayer } from "@videojs-player/vue"
import type { HistoryItem } from "~/types"
import type { VideoPlayerProps, VideoPlayerState } from "@videojs-player/vue"
import {
  useLocalStorage,
  useScreenOrientation,
  useEventListener,
  isIOS,
  useEventBus
} from "@vueuse/core"
import videojs from "video.js"
import "video.js/dist/video-js.css"

const { isIos } = useDevice()
const { angle, lockOrientation, orientation } = useScreenOrientation()
const volume = useLocalStorage<number>("player-volume", 0.5)

const emits = defineEmits(["update"])

const history = useLocalStorage<HistoryItem[]>("player-history", [])
const props = defineProps<{
  title: string
  poster: string
  backdrop: string
  tmdbId: number
  imdbId?: string
  type: string
  playlistId: number
  disableRounded?: boolean
  series?: {
    episode: number
    season: number
  }
  disableHistory?: boolean
}>()

const { data, error, pending, refresh } = await useLazyFetch<
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

const player = ref<VideoJsPlayer>()
const state = shallowRef<VideoPlayerState>()
const mediaConfig = shallowRef<any>()
const config = shallowReactive<VideoPlayerProps>({
  autoplay: false,
  volume: volume.value,
  playbackRate: 1,
  playbackRates: [1],
  controls: true,
  fluid: false,
  muted: false,
  loop: false
})

const bus = useEventBus<{
  time?: number
  type?: string
}>("player")

const playerListener = (payload: { time?: number; type?: string }) => {
  if (!player.value) return
  if (payload?.time) {
    player.value.currentTime(payload.time)
  }
  if (payload?.type === "play") {
    player.value.play()
  } else if (payload?.type === "pause") {
    player.value.pause()
  }
}
bus.on(playerListener)

watch(data, () => {
  if (!data.value) return
  const handledMediaData = getMediaData()
  mediaConfig.value = {
    sources: handledMediaData.sources ?? [],
    poster: props.backdrop || props.poster,
    tracks: handledMediaData.tracks ?? []
  }
})

const handleProgress = (payload: any) => {
  if (!payload || props.disableHistory) return
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

watch(props, () => {
  refresh()
})

const handleMounted = (payload: any) => {
  state.value = payload.state
  player.value = payload.player

  if (!props.disableHistory) {
    const historyItem = history.value.find((e) => e.playlistId === props.playlistId)
    if (historyItem && player.value) {
      player.value.currentTime(historyItem.currentTime)
    }
  }

  if (!player.value) return

  if (!props.disableHistory) {
    player.value.pause()
  }

  player.value.on("timeupdate", () => {
    emits("update", {
      time: player.value?.currentTime()
    })
  })

  player.value.on("play", () => {
    emits("update", {
      time: player.value?.currentTime(),
      type: "play"
    })
  })

  player.value.on("pause", () => {
    emits("update", {
      time: player.value?.currentTime(),
      type: "pause"
    })
  })

  player.value.on("volumechange", () => {
    volume.value = player.value?.volume()
  })

  player.value.addClass("vjs-landscape-fullscreen")

  if (isIos && !player.value.el_.ownerDocument.querySelector(".bc-iframe")) {
    try {
      player.value.tech_.el_.setAttribute("playsinline", "playsinline")
      player.value.tech_.supportsFullScreen = function () {
        return false
      }
    } catch (error) {}
  }

  const rotationHandler = () => {
    if (!player.value) return
    const currentAngle = angle.value

    if (currentAngle === 90 || currentAngle === 270 || currentAngle === -90) {
      if (player.value.paused() === false) {
        player.value.requestFullscreen()
        lockOrientation("landscape")
      }
    }
    if (currentAngle === 0 || currentAngle === 180) {
      if (player.value.isFullscreen()) {
        player.value.exitFullscreen()
      }
    }
  }

  if (isIos) {
    useEventListener("orientationchange", rotationHandler)
  } else if (screen && screen.orientation) {
    watch(
      orientation,
      () => {
        rotationHandler()
      },
      {
        immediate: true
      }
    )
  }

  player.value.on("fullscreenchange", () => {
    if (!player.value) return
    if (videojs.browser.IS_ANDROID || isIOS) {
      if (!angle.value && player.value.isFullscreen()) {
        lockOrientation("landscape")
      }
    }
  })

  player.value.on("dispose", () => {
    window.removeEventListener("orientationchange", rotationHandler)
  })
}
</script>

<style>
.video-js select {
  color: black !important;
}
</style>
