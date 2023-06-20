<script setup lang="ts">
const { posterURL, rating, loading } = defineProps<{
  posterURL?: string
  rating?: number
  loading?: boolean
}>()
</script>

<template>
  <div class="relative flex-shrink-0">
    <div v-if="loading">
      <div
        class="skeleton-effect flex h-[336px] w-56 items-center justify-center rounded bg-gray-300 text-xl font-semibold dark:bg-zinc-800 lg:h-[432px] lg:w-72"
      ></div>
    </div>
    <div v-else>
      <img
        v-if="posterURL"
        class="h-auto w-56 rounded object-cover object-center lg:w-72"
        draggable="false"
        :src="posterURL"
      />
      <div
        v-else
        class="flex h-[336px] w-56 items-center justify-center rounded bg-gray-700 text-xl font-semibold !text-white lg:h-[432px] lg:w-72"
      >
        No Image
      </div>
      <div
        v-if="rating && rating > 0"
        class="absolute bottom-0 left-0 m-2 flex items-center justify-center gap-2 rounded bg-gray-600/20 px-3 py-2 font-semibold !text-white shadow-sm backdrop-blur-md"
      >
        <IconsStarFilled class="h-5 w-5 text-yellow-400" />
        {{ rating.toFixed(1) }}
      </div>
    </div>
  </div>
</template>
