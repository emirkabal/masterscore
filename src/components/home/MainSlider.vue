<script setup lang="ts">
import type { TMDBResult } from "~/types"
import { Swiper as SwiperType } from "swiper"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, EffectFade, Parallax } from "swiper/modules"
import tinycolor from "tinycolor2"
import "swiper/css"
import "swiper/css/effect-fade"
type Custom = TMDBResult & { score?: number }
const props = defineProps<{
  data: Custom[]
}>()

const { $colorthief, $timage } = useNuxtApp()

const filtered = computed(() => {
  return props.data
    .filter((item) => item.backdrop_path && ["tv", "movie"].includes(item.media_type))
    .slice(0, 6)
})

const colors = computed(() => {
  if (!import.meta.client) return []
  const res: { background: string; gradient: string; light: boolean }[] = []
  filtered.value.forEach((item) => {
    const image = new Image()
    image.setAttribute("crossorigin", "anonymous")
    image.src = $timage(item.backdrop_path as string, "w300")
    image.onload = () => {
      const dominantColor = $colorthief.getColor(image, {
        algorithm: "dominant",
        crossOrigin: "anonymous"
      })

      res.push({
        background: dominantColor.rgba,
        gradient: tinycolor(dominantColor.rgb).setAlpha(0.2).toRgbString(),
        light: tinycolor(dominantColor.rgba).getBrightness() > 150
      })
    }
  })
  return res
})

const swiper = ref<SwiperType>()

const activeIndex = ref(0)
const time = ref(0)
const paused = ref(false)
const isReady = ref(false)

const onSwiper = (e: SwiperType) => {
  swiper.value = e
  isReady.value = true
}
const updateControls = (e: SwiperType) => {
  time.value = 100 - e.autoplay.timeLeft / 50
}
const slideChange = (e: SwiperType) => {
  activeIndex.value = e.realIndex
  time.value = 0
}

const slideTo = (index: number) => {
  swiper.value?.slideToLoop(index)
  if (paused.value) {
    paused.value = false
    swiper.value?.autoplay.resume()
  } else {
    paused.value = true
    swiper.value?.autoplay.pause()
  }
}
</script>
<template>
  <div class="relative select-none overflow-hidden rounded-4xl">
    <div
      v-if="!isReady"
      class="skeleton-effect skeleton-effect absolute h-full w-full bg-gray-900"
    ></div>
    <Swiper
      :modules="[Autoplay, EffectFade, Parallax]"
      :slides-per-view="1"
      :effect="'fade'"
      :loop="true"
      :parallax="true"
      :autoplay="{
        delay: 5000
      }"
      @swiper="onSwiper"
      @slide-change="slideChange"
      @autoplay-time-left="updateControls"
      class="relative"
      :class="{
        'opacity-0': !isReady
      }"
    >
      <SwiperSlide v-for="(item, index) in filtered" :key="item.id">
        <div
          class="h-[640px] bg-[length:1280px] bg-[right_calc(-200px)_center] bg-no-repeat lg:bg-[right_calc((-20%)-140px)_center]"
          :style="{
            backgroundImage: `url(${$timage(item.backdrop_path as string, 'w1280')})`
          }"
        >
          <div
            class="relative z-10 h-full w-full bg-gradient-to-r from-gray-950 from-40% to-gray-950/10"
            :style="{
              background: colors?.[index]
                ? `linear-gradient(90deg, ${colors?.[index]?.background} 40%, ${colors?.[index]?.gradient} 100%)`
                : undefined
            }"
          >
            <div
              class="absolute top-1/2 flex w-full -translate-y-1/2 flex-col justify-end gap-4 px-[4vw]"
              :class="{
                'text-black': colors?.[index]?.light
              }"
            >
              <div
                class="-mb-2 text-sm font-medium opacity-90"
                data-swiper-parallax="-200"
                data-swiper-parallax-duration="1000"
              >
                <!-- TODO: i18n -->
                {{ $t("home.trending") }}
              </div>
              <div
                class="flex flex-col gap-2"
                data-swiper-parallax="-200"
                data-swiper-parallax-duration="800"
              >
                <h2 class="text-3xl font-bold tracking-wide">
                  {{ $getTitle(item) }}
                </h2>

                <div class="flex flex-wrap items-center gap-3 font-semibold">
                  <ScoreCircle :score="item.score || item.vote_average" />
                  <div class="flex flex-wrap gap-2">
                    <NuxtLink
                      v-for="genre in item.genre_ids"
                      :to="`/discover?genres=${genre}&type=${item.media_type}`"
                      class="transition-colors hover:text-white/75"
                      :class="{
                        'hover:!text-black/75': colors?.[index]?.light
                      }"
                    >
                      {{ $t("genres." + $tgenre(genre)) }}
                    </NuxtLink>
                  </div>
                  <span>{{ $getYear(item) }}</span>
                </div>
              </div>
              <p
                class="line-clamp-2 max-w-3xl text-sm font-medium tracking-wide text-gray-50 lg:text-lg"
                :class="{
                  '!text-black/80': colors?.[index]?.light
                }"
                data-swiper-parallax="-100"
                data-swiper-parallax-duration="700"
              >
                {{ item.overview }}
              </p>
              <div>
                <NuxtLink
                  :to="`/${item.media_type}/${item.id}`"
                  class="inline-block rounded-full bg-white px-4 py-2 text-lg font-semibold tracking-wide text-black transition-colors hover:bg-gray-200"
                  :class="{
                    '!bg-black !text-white hover:!bg-black/80': colors?.[index]?.light
                  }"
                >
                  {{ $t("home.more_info") }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <div class="pointer-events-none absolute top-0 z-10 h-full w-full">
        <div class="absolute bottom-36 left-[4vw] flex gap-2">
          <SliderControlDot
            v-for="i in filtered.length"
            :key="i"
            :value="activeIndex === i - 1 ? time : 0"
            :active="activeIndex === i - 1"
            :color="colors?.[activeIndex]?.light ? 'black' : 'white'"
            @click="slideTo(i - 1)"
          >
          </SliderControlDot>
        </div>
      </div>
    </Swiper>
  </div>
</template>
