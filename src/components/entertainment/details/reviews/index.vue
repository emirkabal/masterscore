<script setup lang="ts">
import { useUserStore } from "~/store/user"
import type { CollapsedMedia } from "~/types"
const props = defineProps<{
  ctx: CollapsedMedia
}>()

const { data, pending, error, refresh } = useLazyFetch(`/api/media/${props.ctx.media.id}/reviews`, {
  server: false,
  headers: generateHeaders()
})

if (error.value) throw error.value

const userStore = useUserStore()

const test = ref(false)

const review = reactive({
  rating: 0.5,
  content: "",
  spoiler: false,
  pending: false,
  editing: false
})

const emits = defineEmits(["edit", "remove"])

const submitReview = async () => {
  review.pending = true
  await reviewMedia(props.ctx.media.id, {
    ...review
  })

  refresh()
  review.pending = false
  if (review.editing) review.editing = false
}
</script>

<template>
  <section class="px-4" id="reviews">
    <h1 class="my-4 border-l-4 border-yellow-500 pl-4 text-2xl font-bold tracking-wide">
      {{ $t("entertainment.reviews") }}
    </h1>

    <div v-if="pending || error">
      <div class="flex items-center py-6" v-for="i in 4" :key="i">
        <div
          class="skeleton-effect h-14 w-14 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-900"
        ></div>
        <div class="ml-4 flex w-full flex-col">
          <div class="skeleton-effect h-2 w-1/4 rounded bg-gray-300 dark:bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/2 rounded bg-gray-300 dark:bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/3 rounded bg-gray-300 dark:bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/4 rounded bg-gray-300 dark:bg-gray-900"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-col gap-y-12">
        <!-- review -->
        <!-- <EntertainmentDetailsReviewsComment :data="data" /> -->
        <EntertainmentDetailsReviewsCommentCard
          v-if="data?.by_me && !review.editing && userStore.user"
          :comment="data.by_me as any"
          :user="userStore.user as any"
          :edit="true"
          @edit="
            () => {
              review.content = data?.by_me?.content ?? ''
              review.rating = data?.by_me?.rating ?? 0.5
              review.spoiler = data?.by_me?.spoiler ?? false
              review.editing = true
            }
          "
          @delete="
            () => {
              review.content = ''
              review.rating = 0.5
              review.spoiler = false
              deleteReview(ctx.media.id)
              refresh()
            }
          "
        />

        <EntertainmentDetailsReviewsReviewForm
          v-if="userStore.isLoggedIn && userStore.user"
          :by_me="!!data?.by_me"
          :user="userStore.user"
          :review="review"
          @submit="submitReview"
        />

        <EntertainmentDetailsReviewsCommentCard
          v-for="comment in data?.reviews"
          :key="comment.id"
          :comment="comment as any"
          :user="userStore.user as any"
        />
      </div>
    </div>
  </section>
</template>
