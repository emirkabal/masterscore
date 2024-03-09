<script setup lang="ts">
import type { CollapsedMedia } from "~/types"
import { useUserStore } from "~/store/user"
import { onClickOutside } from "@vueuse/core"
const { isMobileOrTablet } = useDevice()
const { user, isLoggedIn } = useUserStore()
const { $listen, $event } = useNuxtApp()

const props = defineProps<{
  data: CollapsedMedia
  reviewData: any
}>()

const modal = ref(false)
const emojiPicker = ref(null)

const isEmojiSelector = ref(false)
onClickOutside(emojiPicker, () => {
  isEmojiSelector.value = false
})

const submitReview = async () => {
  if (!isLoggedIn) {
    return useRouter().push("/account/login")
  }

  modal.value = false

  await $fetch(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify({
      rating: props.reviewData.rating,
      review: props.reviewData.comment,
      spoiler: props.reviewData.spoiler
    })
  })
  $event("entertainment:fetch:reviews", true)
}

watch(props.reviewData, () => {
  if (props.reviewData.rating < 0.5) {
    props.reviewData.rating = 0.5
  }
})

const onSelectEmoji = (emoji: any) => {
  props.reviewData.comment += emoji.i
}

$listen("modal:review", (val) => {
  modal.value = val
})
</script>

<template>
  <Modal
    v-if="!isMobileOrTablet"
    :show="modal"
    @close="modal = false"
    :title="$t('review_modal.title')"
  >
    <template v-slot:body>
      <EntertainmentReviewModalInner :data="props.data" :reviewData="props.reviewData" />
    </template>
    <template v-slot:footer>
      <button class="mr-6 font-semibold hover:underline" @click="modal = false">
        {{ $t("cancel") }}
      </button>
      <button
        @click="submitReview"
        class="rounded bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-500"
      >
        {{ $t("review_modal.submit") }}
      </button>
    </template>
  </Modal>
  <Drawer v-else :title="$t('review_modal.title')" :show="modal" @close="modal = false">
    <template v-slot:body>
      <EntertainmentReviewModalInner :data="props.data" :reviewData="props.reviewData" />
    </template>
    <template v-slot:footer>
      <button
        class="flex h-12 w-full select-none items-center justify-center rounded-full bg-yellow-500 px-4 py-2 font-semibold hover:opacity-75"
        @click="submitReview"
      >
        {{ $t("review_modal.submit") }}
      </button>
    </template>
  </Drawer>
</template>
