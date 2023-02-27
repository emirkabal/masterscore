<script setup>
const { data, pending } = useLazyFetch("/api/likes?limit=1")
</script>
<template>
  <div v-if="!pending">
    <h1
      class="mb-4 border-red-500 pl-2 text-center text-2xl font-bold md:border-l-4 md:text-left"
    >
      Most Liked
    </h1>
    <router-link
      :to="`/details/${data[0].entertainment.type}/${data[0].entertainment.id}`"
      class="group relative z-0 mx-auto block h-96 w-64 cursor-pointer overflow-hidden rounded bg-cover bg-center shadow-2xl md:mx-0"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/w300_and_h450_bestv2/${data[0].entertainment.info.poster})`
      }"
    >
      <div
        class="absolute bottom-0 flex h-auto w-full select-none items-end p-2 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100"
      >
        <div class="flex flex-col justify-center gap-1 p-2">
          <h1 class="line-clamp-1 break-words font-semibold">
            {{ data[0].entertainment.info.title }}
          </h1>
          <div class="flex items-center gap-1">
            <IconsHeartFilled class="h-6 w-6 text-red-600" />
            <p class="text-sm">{{ data[0].likes }} likes</p>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
