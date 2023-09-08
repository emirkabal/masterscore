<script setup lang="ts">
import { SwiperSlide } from "swiper/vue"
const localePath = useLocalePath()

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
    <h1
      class="mb-4 border-l-4 border-green-500 pl-2 text-2xl font-bold tracking-wide"
    >
      Recent Joined
    </h1>
    <EntertainmentSlider>
      <SwiperSlide v-if="pending" v-for="i in 15" :key="i">
        <Avatar :loading="true" username="hello" class="my-3 h-16 w-16" />
      </SwiperSlide>
      <SwiperSlide v-else v-for="user in data" :key="user._id">
        <NuxtLink
          :to="localePath(`/users/@${user.username}`)"
          class="my-3 transition-opacity hover:opacity-75"
        >
          <Avatar
            class="h-16 w-16"
            :username="user.username"
            :avatar="user.avatar"
          />
        </NuxtLink>
      </SwiperSlide>
    </EntertainmentSlider>
  </section>
</template>
