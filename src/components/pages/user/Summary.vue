<script lang="ts" setup>
import type { APISummary } from "~/types"

defineProps<{
  summary: APISummary
}>()
</script>

<template>
  <section class="space-y-12">
    <div v-if="summary.featured.length">
      <h3 class="mb-4 text-xl font-semibold md:text-2xl">
        {{ $t("profile.featured_entertainments") }}
      </h3>
      <EntertainmentSlider
        :data="
          summary.featured.map((e) => {
            return {
              ...e.media,
              vote_average: e.rating
            }
          })
        "
        :show-ratings="true"
      />
    </div>

    <div v-if="summary.last_reviews.length > 0">
      <h3 class="mb-4 text-xl font-semibold md:text-2xl">
        {{ $t("profile.latest_reviews") }}
      </h3>
      <EntertainmentSlider
        :data="
          summary.last_reviews.map((e) => {
            return {
              ...e.media,
              vote_average: e.rating
            }
          })
        "
        :show-ratings="true"
      />
    </div>

    <div v-if="summary.last_likes.length > 0">
      <h3 class="mb-4 text-xl font-semibold md:text-2xl">
        {{ $t("profile.latest_likes") }}
      </h3>
      <EntertainmentSlider :data="summary.last_likes.map((e) => e.media)" />
    </div>
  </section>
</template>
