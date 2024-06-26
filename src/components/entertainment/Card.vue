<script setup lang="ts">
import tinycolor from "tinycolor2"
import type { Media } from "~/types"
const { $colorthief } = useNuxtApp()
const { t } = useI18n()

const props = defineProps<{
  to: string
  media: Media
  title: string
  score?: number
}>()

const strings: Record<string, string> = {
  review: t("activity.reviewed"),
  like: t("activity.liked"),
  watchlist: t("activity.added_to_watchlist")
}

const getActivityTitle = (type: string) => {
  return strings[type] || type
}

const colors = reactive({
  background: [0, 0, 0],
  gradient: [0, 0, 0]
})

const posterUrl = computed(() => {
  return "https://image.tmdb.org/t/p/w200" + props.media.images.poster
})

const nuxtImageRefence = ref()
const imageLoading = ref(true)
const isLight = ref(false)

watch(imageLoading, () => {
  if (nuxtImageRefence.value) {
    const color = $colorthief.getColor(nuxtImageRefence.value.$el, {
      algorithm: "dominant",
      ignoredColor: [
        [255, 255, 255, 255],
        [0, 0, 0, 255]
      ]
    })

    const g = tinycolor(color.rgb).lighten(15)

    isLight.value = g.getBrightness() >= 210
    colors.background = color.value
    colors.gradient = Object.values(g.toRgb())
  }
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="group mt-1 flex w-fit min-w-0 items-center gap-x-2 rounded-lg bg-gray-900 p-2"
    :style="{
      background: imageLoading
        ? ''
        : `linear-gradient(135deg, rgba(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]}, 1) 0%, rgba(${colors.gradient[0]}, ${colors.gradient[1]}, ${colors.gradient[2]}, 1) 100%)`
    }"
  >
    <span class="skeleton-effect h-12 w-8 flex-shrink-0 rounded bg-gray-800" v-if="imageLoading">
    </span>
    <nuxt-img
      ref="nuxtImageRefence"
      :src="posterUrl"
      loading="lazy"
      :alt="media.title"
      @load="imageLoading = false"
      :onload="() => (imageLoading = false)"
      class="h-12 w-8 rounded"
      crossorigin="anonymous"
      :class="{
        'absolute opacity-0': imageLoading
      }"
      draggable="false"
    />
    <div
      class="flex flex-col items-start justify-center font-medium"
      :class="{
        'text-white': !isLight,
        'text-black': isLight
      }"
    >
      <span class="text-xs opacity-75">
        {{ getActivityTitle(title) }} {{ score && `${score}/10` }}
      </span>
      <span class="line-clamp-1 break-all">
        {{ media.title }}
      </span>
    </div>
  </NuxtLink>
</template>
