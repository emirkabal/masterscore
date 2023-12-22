<script setup lang="ts">
import { SwiperSlide } from "swiper/vue"

const { data, pending } = await useLazyFetch<
  {
    _id: string
    username: string
    avatar?: string
  }[]
>("/api/feed/users")
</script>

<template>
  <section>
    <EntertainmentSlider :offset="16">
      <SwiperSlide v-if="pending" v-for="i in 15" :key="i">
        <Avatar :loading="true" username="hello" class="my-3 h-16 w-16" />
      </SwiperSlide>
      <SwiperSlide v-else v-for="user in data" :key="user._id">
        <NuxtLink :to="`/users/@${user.username}`" class="my-3 transition-opacity hover:opacity-75">
          <Avatar class="h-16 w-16" :username="user.username" :avatar="user.avatar" />
        </NuxtLink>
      </SwiperSlide>
    </EntertainmentSlider>
  </section>
</template>
