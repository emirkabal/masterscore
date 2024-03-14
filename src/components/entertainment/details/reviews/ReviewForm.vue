<script lang="ts" setup>
defineProps<{
  by_me: boolean
  review: any
  user: any
}>()

const focused = ref(false)
</script>

<template>
  <div
    v-if="user && ((by_me && review.editing) || !by_me)"
    class="hidden gap-x-4 md:flex"
    :class="review.pending && 'pointer-events-none opacity-25'"
  >
    <Avatar
      :username="user.username"
      :avatar="user.avatar"
      :square="user.verified"
      class="h-10 w-10 flex-shrink-0 origin-top scale-[.78] transition duration-300 md:h-14 md:w-14"
      :class="{
        '!scale-100': focused || review.editing
      }"
    />
    <div class="relative flex w-full flex-col gap-y-2">
      <div class="relative w-full">
        <textarea
          type="text"
          :value="review.content"
          :maxlength="512"
          @input="(e: any) => (review.content = e.target.value)"
          :placeholder="$t('review_modal.placeholder')"
          class="h-11 w-full select-none resize-none rounded border border-gray-800 bg-gray-900 p-2 outline-none ring-gray-700 transition-all duration-300 focus:h-28 focus:outline-none focus:ring-1"
          :class="{
            '!h-28 ': review.editing || focused
          }"
          @focus="() => (focused = true)"
        />
      </div>
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all opacity-300 duration-300 absolute -bottom-14 w-full"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 bottom-4"
      >
        <div v-if="focused || review.editing" class="flex items-center justify-between">
          <div class="flex flex-wrap items-center gap-x-4">
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
                :star-size="32"
                inactiveColor="#1f2937"
                starColor="#facc15"
                v-model="review.rating"
              ></StarRating>
            </div>
          </div>

          <div class="flex justify-end">
            <div class="flex items-center justify-end gap-x-2">
              <Button
                variant="ghost"
                v-if="(by_me && review.editing) || focused"
                @click="
                  () => {
                    review.editing = false
                    focused = false
                  }
                "
                :disabled="review.pending"
              >
                {{ $t("cancel") }}
              </Button>
              <Button
                @click="$emit('submit')"
                type="button"
                :disabled="review.pending"
                class="self-end bg-brand font-semibold transition hover:bg-brand/90"
              >
                {{ $t("review_modal.review") }}
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style></style>
