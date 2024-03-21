<script lang="ts" setup>
import type { APIUser, APISummary } from "~/types"

defineProps<{
  user: APIUser
  summary: APISummary
}>()
</script>

<template>
  <section class="mt-12 space-y-12">
    <div v-if="summary.featured.length">
      <h3 class="mb-4 text-xl font-semibold tracking-tight md:text-2xl">
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

    <div v-if="summary.last_reviews.length">
      <div class="mb-4 flex items-center gap-x-4">
        <h3 class="text-xl font-semibold tracking-tight md:text-2xl">
          {{ $t("profile.latest_reviews") }}
        </h3>
        <NuxtLink
          :to="`/${user.username}/reviews`"
          class="text-sm font-semibold tracking-tight text-gray-500 transition hover:text-gray-300"
        >
          {{ $t("see-all") }}
        </NuxtLink>
      </div>
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

    <div v-if="summary.last_likes.length">
      <h3 class="mb-4 text-xl font-semibold tracking-tight md:text-2xl">
        {{ $t("profile.latest_likes") }}
      </h3>
      <EntertainmentSlider :data="summary.last_likes.map((e) => e.media)" />
    </div>
  </section>
</template>
