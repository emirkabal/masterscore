<script setup lang="ts">
import { TMDBSearchResult } from "~/@types"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation } from "swiper/modules"
import { useEventListener } from "@vueuse/core"
import "swiper/css"

defineProps<{
  data: TMDBSearchResult[]
  itemSize?: "default" | "large"
  fixedMediaType?: "movie" | "tv"
  offset?: "auto" | number
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
      :modules="[Navigation]"
      :slidesPerView="'auto'"
      :spaceBetween="10"
      :slidesPerGroup="3"
      :slidesOffsetAfter="offset === 'auto' ? vw4 : offset"
      :slidesOffsetBefore="offset === 'auto' ? vw4 : offset"
      :navigation="{
        enabled: true,
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }"
    >
      <SwiperSlide v-for="item in data" :key="item.id">
        <EntertainmentSliderCard
          :image="$timage(item.poster_path || '', 'w342')"
          :id="item.id"
          :media_type="item.media_type || fixedMediaType || 'movie'"
          :size="itemSize"
        />
      </SwiperSlide>

      <div class="swiper-button-prev">
        <IconsChevron class="h-10 w-10" />
      </div>
      <div class="swiper-button-next">
        <IconsChevron class="h-10 w-10 rotate-180" />
      </div>
    </Swiper>
  </div>
</template>

<style scoped>
.swiper {
  @apply h-auto select-none;
}
.swiper-slide {
  @apply h-auto w-auto;
}

.swiper-button-prev,
.swiper-button-next {
  @apply absolute top-1/2 z-10 mt-[-5px] hidden h-10 w-10 cursor-pointer select-none bg-black/20 bg-contain bg-center bg-no-repeat hover:bg-black/50 md:block;
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
