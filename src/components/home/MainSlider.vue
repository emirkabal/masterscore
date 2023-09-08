<script setup lang="ts">
import { Swiper as SwiperType } from "swiper"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, EffectFade, Parallax } from "swiper/modules"
import { TMDBSearchResult } from "~/@types"
import "swiper/css"
import "swiper/css/effect-fade"
const localePath = useLocalePath()
const props = defineProps<{
  data: TMDBSearchResult[]
}>()

const filtered = computed(() => {
  return props.data
    .filter(
      (item) => item.backdrop_path && ["tv", "movie"].includes(item.media_type)
    )
    .slice(0, 6)
})

const swiper = ref<SwiperType>()

const activeIndex = ref(0)
const time = ref(0)

const onSwiper = (e: SwiperType) => {
  swiper.value = e
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
}
</script>
<template>
  <div class="select-none">
    <Swiper
      :modules="[Autoplay, EffectFade, Parallax]"
      :slides-per-view="1"
      :effect="'fade'"
      :loop="true"
      :parallax="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false
      }"
      @swiper="onSwiper"
      @slide-change="slideChange"
      @autoplay-time-left="updateControls"
    >
      <SwiperSlide v-for="item in filtered" :key="item.id">
        <div
          class="h-[85vh] bg-cover bg-top bg-no-repeat"
          :style="{
            backgroundImage: `linear-gradient(
            rgba(0, 0, 0, 0) 0%,
            rgb(0, 0, 0) 100%
          ), url(${$timage(item.backdrop_path || '-', 'original')})`
          }"
        >
          <div class="relative h-full w-full">
            <div
              class="absolute top-[22vh] flex h-1/2 w-full flex-col justify-end gap-4 px-[4vw] font-maven text-white"
            >
              <div
                class="flex flex-col gap-2"
                data-swiper-parallax="-200"
                data-swiper-parallax-duration="800"
              >
                <h1 class="text-xl font-bold lg:text-5xl">
                  {{ $getTitle(item) }}
                </h1>

                <div class="flex items-center gap-3 text-xl font-bold">
                  <ScoreCircle :score="item.vote_average" />
                  <span>{{ $getYear(item) }}</span>
                </div>
              </div>
              <p
                class="line-clamp-2 max-w-3xl text-sm font-medium tracking-wide text-gray-50 lg:text-lg"
                data-swiper-parallax="-100"
                data-swiper-parallax-duration="700"
              >
                {{ item.overview }}
              </p>
              <div>
                <NuxtLink
                  :to="localePath(`/details/${item.media_type}/${item.id}`)"
                  class="inline-block rounded border-2 border-white px-4 py-1.5 text-lg font-bold transition-opacity hover:opacity-75 lg:border-4 lg:px-6 lg:py-3"
                >
                  {{ $t("home.more_info") }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <div class="pointer-events-none absolute top-0 z-10 h-screen w-full">
        <div class="absolute bottom-[31vh] left-[4vw] flex gap-2">
          <SliderControlDot
            v-for="i in filtered.length"
            :key="i"
            :value="activeIndex === i - 1 ? time : 0"
            :active="activeIndex === i - 1"
            @click="slideTo(i - 1)"
          >
          </SliderControlDot>
        </div>
      </div>
    </Swiper>
  </div>
</template>
