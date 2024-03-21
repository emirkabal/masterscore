<script lang="ts" setup>
import type { Review } from "~/types"
import { vIntersectionObserver } from "@vueuse/components"

const route = useRoute()
const username = computed(() => route.params.username as string)

const user = await getUser(username.value)

if (!user)
  throw createError({
    statusCode: 404,
    message: "User not found"
  })

const reviews = reactive({
  page: 1,
  finished: false,
  pending: false,
  data: [] as Review[]
})

const fetchReviews = async () => {
  if (reviews.finished || reviews.pending) return

  reviews.pending = true

  const data = await $fetch<Review[]>(
    `/api/users/${user.username}/reviews?page=${reviews.page}&limit=20`
  )
  reviews.data = [...reviews.data, ...data]

  if (data.length < 20) reviews.finished = true

  reviews.page++
  reviews.pending = false
}

fetchReviews()

function onIntersectionObserver([{ isIntersecting }]: any) {
  if (isIntersecting) fetchReviews()
}

useHead({
  title: user.display_name ? `${user.display_name} (${user.username})` : user.username,
  titleTemplate: "%s Reviews - Masterscore"
})
</script>

<template>
  <div class="preffered-background min-h-screen py-28">
    <div class="container mx-auto">
      <PagesUserCard
        :user="user"
        :small="true"
        :text="$t('profile.reviews', user._count.reviews)"
      />

      <div class="space-y-8 pt-4">
        <div
          v-for="review in reviews.data"
          class="gap-x-2 space-y-4 rounded-lg border border-gray-800 bg-gray-900/45 p-4"
        >
          <EntertainmentCard
            :to="`/${review.media.type}/${review.media.tmdb_id}`"
            :media="review.media"
            :score="review.rating"
            title="review"
          />

          <EntertainmentDetailsReviewsContent :review="review" :skip-info="true" />

          <span
            v-tooltip="{
              content: $moment(review.created_at).locale($i18n.locale).format('LLLL')
            }"
            class="flex-shrink-0 cursor-default text-xs text-gray-300"
          >
            {{ $moment(review.created_at).locale($i18n.locale).calendar() }}
          </span>
        </div>

        <div class="h-1 w-1" v-intersection-observer="onIntersectionObserver"></div>
        <Spinner v-if="reviews.pending" class="mx-auto" />
      </div>
    </div>
  </div>
</template>
