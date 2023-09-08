<script setup lang="ts">
import { TMDBSearchResult } from "~/@types"

const props = defineProps<{
  data?: {
    results: TMDBSearchResult[]
  }
  loading?: boolean
}>()

const { type } = useRoute().params as {
  type: "movie" | "tv"
}

const getName = computed(() => {
  if (type === "tv") return "TV Shows"
  else return "Movies"
})
</script>
<template>
  <section v-if="loading || data">
    <h1
      v-if="data && data.results.length > 0"
      class="my-4 border-l-4 border-pink-600 pl-4 text-2xl font-bold tracking-wide"
    >
      Similar {{ getName }}
    </h1>
    <div v-if="!data || loading">
      <div
        class="skeleton-effect my-4 h-6 w-32 rounded bg-gray-300 dark:bg-zinc-800"
      ></div>
      <div class="flex gap-2 overflow-x-hidden">
        <div class="flex flex-col" v-for="i in 8" :key="i">
          <div
            class="skeleton-effect h-40 w-[100px] rounded bg-gray-300 dark:bg-zinc-800 md:h-[300px] md:w-[200px]"
          ></div>
        </div>
      </div>
    </div>
    <div v-else-if="data && data.results.length > 0">
      <EntertainmentSlider
        :data="data.results"
        :fixed-media-type="type"
        :offset="0"
      />
    </div>
  </section>
</template>
