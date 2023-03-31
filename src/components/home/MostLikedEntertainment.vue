<script setup>
const { data, pending } = useLazyFetch("/api/likes?limit=1")
</script>
<template>
  <div>
    <h1
      class="mb-4 border-l-4 border-red-600 pl-2 text-2xl font-bold tracking-wide"
    >
      Most Recommended
    </h1>
    <div
      v-if="pending"
      class="skeleton-effect relative z-0 mx-auto block h-96 w-full overflow-hidden rounded bg-gray-300 dark:bg-zinc-800 md:mx-0 lg:w-64"
    ></div>
    <NuxtLink
      v-else
      :to="`/details/${data[0].entertainment.type}/${data[0].entertainment.id}`"
      class="group relative z-0 mx-auto block h-96 w-full cursor-pointer overflow-hidden rounded bg-cover bg-center bg-no-repeat shadow-2xl md:mx-0 lg:w-64"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/w500/${data[0].entertainment.info.poster})`
      }"
    >
      <div
        class="absolute bottom-0 flex h-auto w-full select-none items-end p-2 text-white opacity-100 backdrop-blur transition-all md:opacity-0 md:group-hover:opacity-100"
      >
        <div class="flex flex-col justify-center gap-1 p-2">
          <h1 class="break-words font-semibold line-clamp-1">
            {{ data[0].entertainment.info.title }}
          </h1>
          <div class="flex items-center gap-1">
            <IconsHeartFilled class="h-6 w-6 text-red-600" />
            <p class="text-sm">{{ data[0].likes }} people recommended</p>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
