<script setup>
const { data, pending } = useLazyFetch("/api/likes?limit=1")
</script>
<template>
  <div v-if="!pending">
    <h1 class="text-2xl font-bold md:border-l-4 pl-2 mb-4 border-red-500">
      Most Liked
    </h1>
    <router-link
      :to="`/details/${data[0].entertainment.type}/${data[0].entertainment.id}`"
      class="w-64 h-96 rounded shadow-2xl z-0 bg-cover bg-center group overflow-hidden cursor-pointer block relative"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/w300_and_h450_bestv2/${data[0].entertainment.info.poster})`
      }"
    >
      <div
        class="w-full h-auto opacity-0 bottom-0 group-hover:opacity-100 text-white backdrop-blur p-2 transition-all absolute flex items-end select-none"
      >
        <div class="flex flex-col justify-center gap-1 p-2">
          <h1 class="font-semibold break-words line-clamp-1">
            {{ data[0].entertainment.info.title }}
          </h1>
          <div class="flex gap-1 items-center">
            <IconsHeartFilled class="text-red-600 w-6 h-6" />
            <p class="text-sm">{{ data[0].likes }} likes</p>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
