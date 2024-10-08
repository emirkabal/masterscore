<script setup lang="ts">
import type { CollapsedMedia } from "~/types"
import { useMediaQuery } from "@vueuse/core"
import { useUserStore } from "~/store/user"

const isDesktop = useMediaQuery("(min-width: 768px)")
const preferences = usePreferences()
const { $event } = useNuxtApp()

const props = defineProps<{
  ctx: CollapsedMedia
}>()

const { data, status, error, refresh } = useLazyFetch(`/api/media/${props.ctx.media.id}/reviews`, {
  headers: generateHeaders()
})

if (error.value) throw error.value

const userStore = useUserStore()
userStore.waitForUser().then((v) => v && refresh())

const review = reactive({
  rating: 0.5,
  content: "",
  spoiler: false,
  pending: false,
  editing: false
})

watch(data, () => {
  if (data.value?.by_me) {
    review.content = data.value.by_me.content ?? ""
    review.rating = data.value.by_me.rating
    review.spoiler = data.value.by_me.spoiler ?? false
  }
})

const emits = defineEmits(["edit", "remove"])

const edit = () => {
  if (isDesktop.value && !preferences.value.use_old_review_modal) review.editing = true
  else $event("modal:review", true)
}

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

    <div v-if="status === 'pending'">
      <div class="flex items-center py-6" v-for="i in 4" :key="i">
        <div class="skeleton-effect h-14 w-14 flex-shrink-0 rounded-full bg-gray-900"></div>
        <div class="ml-4 flex w-full flex-col">
          <div class="skeleton-effect h-2 w-1/4 rounded bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/2 rounded bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/3 rounded bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/4 rounded bg-gray-900"></div>
        </div>
      </div>
    </div>
    <div v-else-if="status === 'error'">
      <p>Something went wrong</p>
    </div>
    <div v-else>
      <div class="flex flex-col gap-y-12">
        <span
          v-if="userStore.user && (!isDesktop || preferences.use_old_review_modal)"
          @click="() => (preferences.use_old_review_modal = !preferences.use_old_review_modal)"
          class="cursor-pointer hover:underline"
        >
          Disable old review modal
        </span>

        <EntertainmentDetailsReviewsCommentCard
          v-if="data?.by_me && !review.editing && userStore.user"
          :comment="data.by_me"
          :user="userStore.user"
          @edit="edit"
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
        <EntertainmentDetailsReviewsModal
          v-if="userStore.user"
          :review="review"
          @submit="submitReview"
        />
        <EntertainmentDetailsReviewsReviewForm
          v-if="isDesktop && !preferences.use_old_review_modal"
          :by_me="!!data?.by_me"
          :user="userStore.user"
          :review="review"
          @submit="submitReview"
        />
        <Button
          v-if="userStore.user && !data?.by_me && (!isDesktop || preferences.use_old_review_modal)"
          @click="edit"
          class="w-fit"
        >
          {{ $t("review_modal.review") }}
        </Button>

        <EntertainmentDetailsReviewsCommentCard
          v-for="(comment, i) in data?.reviews"
          :key="comment.id"
          :index="i"
          :comment="comment"
          :user="userStore.user"
        />

        <div v-if="!data?.reviews.length && !data?.by_me && !userStore.isLoggedIn">
          <div class="flex flex-col items-center lg:items-start">
            <p class="text-center lg:text-left">
              {{ $t("no_comment_for_this_review") }}
            </p>
            <NuxtLink
              v-if="!userStore.isLoggedIn"
              :to="`/account/login?r=${$route.fullPath}`"
              class="mt-2 items-center rounded bg-yellow-500 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-600"
              >{{ $t("guest.sign_in") }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
