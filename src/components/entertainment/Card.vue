<script setup lang="ts">
import { IEntertainment } from "~/@types"
import tinycolor from "tinycolor2"
const { $colorthief } = useNuxtApp()
const { t } = useI18n()

const props = defineProps<{
  to: string
  entertainment: IEntertainment
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
  return "https://image.tmdb.org/t/p/w200" + props.entertainment.info.poster
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
    class="group mt-1 flex w-fit min-w-0 items-center gap-x-2 rounded-lg bg-gray-500 p-2 dark:bg-zinc-800"
    :style="{
      background: imageLoading
        ? ''
        : `linear-gradient(135deg, rgba(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]}, 1) 0%, rgba(${colors.gradient[0]}, ${colors.gradient[1]}, ${colors.gradient[2]}, 1) 100%)`
    }"
  >
    <span
      class="skeleton-effect h-12 w-8 flex-shrink-0 rounded bg-gray-400 dark:bg-zinc-900"
      v-if="imageLoading"
    >
    </span>
    <nuxt-img
      ref="nuxtImageRefence"
      :src="posterUrl"
      loading="lazy"
      :alt="entertainment.info.title"
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
        {{ entertainment.info.title }}
      </span>
    </div>
  </NuxtLink>
</template>
