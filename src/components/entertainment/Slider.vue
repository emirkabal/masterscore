<script setup lang="ts">
import type { CollapsedMedia, CreditsResult, Media, TMDBResult } from "~/types"
import { Swiper, SwiperSlide } from "swiper/vue"
import { FreeMode, Mousewheel, Navigation } from "swiper/modules"
import { useEventListener } from "@vueuse/core"
import "swiper/css"

defineProps<{
  data?: TMDBResult[] | CollapsedMedia[] | Media[] | CreditsResult[]
  showRatings?: boolean
  itemSize?: "default" | "large"
  fixedMediaType?: "movie" | "tv"
  offset?: "auto" | number
  loading?: boolean
}>()

const vw = window?.innerWidth
const px = vw / 100
const vw4 = ref(px * 4)

useEventListener("resize", () => {
  const vw = window?.innerWidth
  const px = vw / 100
  vw4.value = px * 4
})
</script>
<template>
  <div class="relative">
    <Swiper
      :modules="[Navigation, FreeMode, Mousewheel]"
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
      :mousewheel="{
        enabled: true,
        forceToAxis: true
      }"
      :navigation="{
        enabled: true,
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }"
    >
      <SwiperSlide v-if="loading" v-for="i in 13" :key="i">
        <EntertainmentSliderCard class="flex-shrink-0" :loading="true" :size="itemSize" />
      </SwiperSlide>
      <SwiperSlide v-else v-for="item in data" :key="item.id">
        <EntertainmentSliderCard
          :image="
            ('tmdb_id' in item && item.images.poster) || ('poster_path' in item && item.poster_path)
              ? $timage(
                  ('tmdb_id' in item && item.images.poster) ||
                    ('poster_path' in item && item.poster_path) ||
                    '',
                  'w342'
                )
              : 'loading'
          "
          :to="$tlink(item)"
          :size="itemSize"
          :rating="showRatings && 'vote_average' in item ? item.vote_average : undefined"
        />
      </SwiperSlide>
      <slot />

      <div class="swiper-button-prev">
        <Icon name="ic:round-chevron-left" class="h-10 w-10" />
      </div>
      <div class="swiper-button-next">
        <Icon name="ic:round-chevron-right" class="h-10 w-10" />
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
