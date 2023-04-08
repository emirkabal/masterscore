<script setup>
const props = defineProps({
  id: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  poster: {
    type: String,
    required: false
  },
  backdrop: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    required: false
  },
  overview: {
    type: String,
    required: false
  },
  loading: {
    type: Boolean,
    required: false
  }
})
const formatter = Intl.NumberFormat("en", { notation: "compact" })
const formatted = computed(() => {
  return formatter.format(props.rating || 0)
})
</script>
<template>
  <div
    class="group relative flex flex-col items-center justify-center overflow-hidden rounded bg-gray-100 dark:bg-zinc-900"
    :class="{
      'cursor-pointer': !props.loading
    }"
  >
    <div
      v-if="props.loading"
      class="skeleton-effect flex h-52 w-full items-center justify-center gap-4 p-4"
    >
      <div
        class="h-36 w-20 flex-shrink-0 rounded bg-gray-300 dark:bg-zinc-800"
      ></div>
      <div class="flex w-full flex-col gap-2">
        <div class="h-3 w-32 rounded-full bg-gray-300 dark:bg-zinc-800"></div>
        <div
          class="h-2 w-10/12 rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div
          class="w-12/12 h-2 rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div class="h-2 w-8/12 rounded-full bg-gray-300 dark:bg-zinc-800"></div>
        <div
          class="h-2 w-10/12 rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
      </div>
    </div>
    <NuxtLink
      :to="`/details/${props.type}/${props.id}`"
      v-else
      class="z-0 flex h-52 w-full select-none items-center rounded bg-cover bg-center bg-no-repeat"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${props.backdrop})`
      }"
    >
      <div
        class="absolute h-full w-full bg-zinc-800 bg-opacity-75 transition-all group-hover:bg-opacity-50 dark:bg-black dark:bg-opacity-75"
      ></div>
      <div class="flex items-center justify-center gap-4 p-4">
        <div
          class="z-10 h-36 w-20 flex-shrink-0 rounded bg-cover bg-center bg-no-repeat drop-shadow-2xl"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/w500/${props.poster})`
          }"
        ></div>
        <div class="z-10 !text-white">
          <div
            class="mb-1 line-clamp-1 font-maven font-semibold leading-5 drop-shadow-2xl"
          >
            {{ props.title }}
          </div>
          <div
            class="mb-2 line-clamp-4 text-ellipsis text-sm leading-4 opacity-75 drop-shadow-2xl"
          >
            {{ props.overview }}
          </div>
          <div
            v-if="props.rating"
            class="inline-flex items-center justify-center gap-1 rounded bg-gray-600/20 px-2 py-0.5 font-semibold !text-white shadow-2xl backdrop-blur"
          >
            <IconsPopular class="h-5 w-5 text-red-500" />
            {{ formatted }}
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
