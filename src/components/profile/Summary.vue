<script setup lang="ts">
import { IEntertainment, IReview } from "~/@types"

defineProps<{
  summary: {
    pending: boolean
    featured: IReview[]
    reviews: IEntertainment[]
    recommendations: IEntertainment[]
    watchlist: IEntertainment[]
  }
}>()
</script>

<template>
  <div class="my-8">
    <div v-if="summary.pending" class="space-y-4">
      <div v-for="i in 4" :key="'ppp-' + i">
        <div
          class="skeleton-effect mb-4 h-4 w-32 rounded bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div class="flex gap-2 overflow-x-hidden">
          <div class="flex flex-col" v-for="i in 8" :key="i">
            <div
              class="skeleton-effect h-40 w-[100px] rounded bg-gray-300 dark:bg-zinc-800 md:h-[300px] md:w-[200px]"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="space-y-4">
      <div v-if="summary.featured.length > 0">
        <h1 class="mb-4 text-xl font-semibold md:text-2xl">
          {{ $t("profile.featured_entertainments") }}
        </h1>
        <EntertainmentSlider
          :data="
            summary.featured.map((e) => {
              return {
                ...e.entertainment,
                vote_average: e.rating
              }
            })
          "
          :show-ratings="true"
        />
      </div>

      <div v-if="summary.reviews.length > 0">
        <h1 class="mb-4 text-xl font-semibold md:text-2xl">
          {{ $t("profile.latest_reviews") }}
        </h1>
        <EntertainmentSlider :data="summary.reviews" />
      </div>

      <div v-if="summary.recommendations.length > 0">
        <h1 class="mb-4 text-xl font-semibold md:text-2xl">
          {{ $t("profile.latest_likes") }}
        </h1>
        <EntertainmentSlider :data="summary.recommendations" />
      </div>

      <div v-if="summary.watchlist.length > 0">
        <h1 class="mb-4 text-xl font-semibold md:text-2xl">
          {{ $t("profile.last_added_to_watchlist") }}
        </h1>
        <EntertainmentSlider :data="summary.watchlist" />
      </div>
    </div>
  </div>
</template>
