<script lang="ts" setup>
defineProps<{
  by_me: boolean
  review: any
  user: any
}>()
</script>

<template>
  <div
    v-if="user && ((by_me && review.editing) || !by_me)"
    class="hidden gap-x-4 lg:flex"
    :class="review.pending && 'pointer-events-none opacity-25'"
  >
    <Avatar
      :username="user.username"
      :avatar="user.avatar"
      :square="user.verified"
      class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
    />
    <div class="flex w-full flex-col gap-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <FormStarInput
          :rating="review.rating"
          @update:rating="(val: number) => (review.rating = val)"
        />
        <div
          @click="
            () => {
              if (review.rating >= 9.6) review.rating = 10
            }
          "
        >
          <StarRating
            :animate="true"
            :numberOfStars="10"
            :star-size="36"
            inactiveColor="#1f2937"
            starColor="#facc15"
            v-model="review.rating"
          ></StarRating>
        </div>
      </div>
      <div class="relative w-full">
        <textarea
          type="text"
          :value="review.content"
          :maxlength="512"
          @input="(e: any) => (review.content = e.target.value)"
          :placeholder="$t('review_modal.placeholder')"
          class="h-11 w-full select-none resize-none rounded border border-gray-800 bg-gray-900 p-2 outline-none transition-all duration-100 focus:h-28 focus:outline-none focus:ring-1 focus:ring-gray-700"
          :class="{
            '!h-28': review.content.length > 0
          }"
        />
      </div>
      <div class="flex items-center justify-end gap-x-2">
        <button
          v-if="by_me && review.editing"
          @click="review.editing = false"
          :disabled="review.pending"
          type="button"
          class="self-end rounded-xl px-4 py-2 font-semibold transition hover:opacity-75"
        >
          {{ $t("cancel") }}
        </button>
        <button
          @click="$emit('submit')"
          type="button"
          :disabled="review.pending"
          class="self-end rounded-xl bg-brand px-4 py-2 font-semibold text-black transition hover:opacity-75"
        >
          {{ $t("review_modal.review") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
