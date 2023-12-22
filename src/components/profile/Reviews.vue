<script setup lang="ts">
import type { IReview } from "~/types"
defineProps<{
  reviews: {
    pending: boolean
    items: IReview[]
  }
}>()
</script>

<template>
  <div class="mt-12">
    <div v-if="reviews.pending" class="flex flex-col gap-6">
      <div v-for="i in 10" :key="i">
        <div class="flex items-start">
          <div
            class="skeleton-effect mr-4 h-16 w-10 rounded bg-gray-300 md:h-24 md:w-16 dark:bg-gray-900"
          ></div>

          <div class="flex flex-col gap-2">
            <div class="skeleton-effect h-3 w-24 rounded bg-gray-300 dark:bg-gray-900"></div>
            <div class="skeleton-effect h-2 w-32 rounded bg-gray-300 dark:bg-gray-900"></div>
            <div class="skeleton-effect h-2 w-12 rounded bg-gray-300 dark:bg-gray-900"></div>
            <div class="skeleton-effect h-2 w-20 rounded bg-gray-300 dark:bg-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="reviews.items.length === 0" class="flex justify-center">
      <p class="text-gray-500 dark:text-gray-200">No reviews found</p>
    </div>
    <div class="flex flex-col gap-6" v-else>
      <div v-for="review in reviews.items" :key="review._id">
        <div class="flex items-start overflow-hidden rounded">
          <NuxtLink :to="`/details/${review.entertainment.type}/${review.entertainment.id}`">
            <MasterImage
              v-if="review.entertainment.info.poster"
              :source="$timage(review.entertainment.info.poster, 'w92')"
              class="mr-4 h-16 w-10 rounded-lg md:h-24 md:w-16"
            />
          </NuxtLink>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/details/${review.entertainment.type}/${review.entertainment.id}`"
                class="line-clamp-1 font-semibold hover:underline"
              >
                {{ review.entertainment.info.title }}
              </NuxtLink>
              <p
                v-tooltip="{
                  content: $moment(review.createdAt).locale($i18n.locale).fromNow()
                }"
                class="flex-shrink-0 cursor-default text-base text-gray-500 dark:text-gray-400"
              >
                {{ $moment(review.createdAt).locale($i18n.locale).calendar() }}
              </p>
            </div>
            <span class="text-sm opacity-90"> Reviewed: {{ review.rating }}/10 </span>
            <ReviewContent :review="review" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
