<script setup lang="ts">
import { IEntertainment, TMDBData, TMDBSearchResult } from "~/@types"
import { Swiper, SwiperSlide } from "swiper/vue"
import { FreeMode, Navigation } from "swiper/modules"
import { useEventListener } from "@vueuse/core"
import "swiper/css"

defineProps<{
  data?: TMDBSearchResult[] | TMDBData[] | IEntertainment[]
  showRatings?: boolean
  itemSize?: "default" | "large"
  fixedMediaType?: "movie" | "tv"
  offset?: "auto" | number
  loading?: boolean
}>()

const vw = window.innerWidth
const px = vw / 100
const vw4 = ref(px * 4)

useEventListener("resize", () => {
  const vw = window.innerWidth
  const px = vw / 100
  vw4.value = px * 4
})
</script>
<template>
  <div class="relative">
    <Swiper
      :modules="[Navigation, FreeMode]"
      :slidesPerView="'auto'"
      :spaceBetween="10"
      :slidesPerGroup="2"
      :slidesOffsetAfter="offset === 'auto' ? vw4 : offset"
      :slidesOffsetBefore="offset === 'auto' ? vw4 : offset"
      :freeMode="{
        enabled: true,
        sticky: false,
        momentumBounce: false,
        minimumVelocity: 0.1
      }"
      :navigation="{
        enabled: true,
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }"
    >
      <SwiperSlide v-if="loading" v-for="i in 13" :key="i">
        <EntertainmentSliderCard
          class="flex-shrink-0"
          :loading="true"
          :size="itemSize"
        />
      </SwiperSlide>
      <SwiperSlide v-else v-for="item in data" :key="item.id">
        <EntertainmentSliderCard
          :image="
            $timage(
              ('info' in item ? item.info.poster : item.poster_path) || '',
              'w342'
            )
          "
          :id="item.id"
          :media_type="
            ('info' in item ? item.type : item.media_type) ||
            fixedMediaType ||
            'movie'
          "
          :size="itemSize"
          :rating="
            showRatings && 'vote_average' in item
              ? item.vote_average
              : undefined
          "
        />
      </SwiperSlide>
      <slot />

      <div class="swiper-button-prev">
        <IconsChevron class="h-10 w-10" />
      </div>
      <div class="swiper-button-next">
        <IconsChevron class="h-10 w-10 rotate-180" />
      </div>
    </Swiper>
  </div>
</template>

<style>
.swiper {
  @apply h-auto select-none;
}
.swiper-slide {
  @apply h-auto w-auto;
}

.swiper-button-prev,
.swiper-button-next {
  @apply absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer select-none bg-black/20 bg-contain bg-center bg-no-repeat hover:bg-black/50 md:block;
}

.swiper-button-prev {
  left: 0;
}

.swiper-button-next {
  right: 0;
}

.swiper-button-lock {
  display: none;
}

.swiper-container:hover .swiper-button-lock {
  display: block;
}

.swiper-button-disabled {
  display: none;
}
</style>
