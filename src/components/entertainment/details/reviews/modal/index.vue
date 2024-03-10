<script setup lang="ts">
import { onClickOutside, useMediaQuery } from "@vueuse/core"
const { $listen, $dispatch } = useNuxtApp()
const isDesktop = useMediaQuery("(min-width: 768px)")

const props = defineProps<{
  review: any
}>()

const modal = ref(false)
const emojiPicker = ref(null)

const isEmojiSelector = ref(false)
onClickOutside(emojiPicker, () => {
  isEmojiSelector.value = false
})

watch(props.review, () => {
  if (props.review.rating < 0.5) {
    props.review.rating = 0.5
  }
})

const handleEvent = (val: boolean) => {
  modal.value = val
}

onMounted(() => $listen("modal:review", handleEvent))
onUnmounted(() => $dispatch("modal:review", handleEvent))
</script>

<template>
  <Modal v-if="isDesktop" :show="modal" @close="modal = false" :title="$t('review_modal.title')">
    <template v-slot:body>
      <EntertainmentDetailsReviewsModalContent :review="review" />
    </template>
    <template v-slot:footer>
      <button class="mr-6 font-semibold hover:underline" @click="modal = false">
        {{ $t("cancel") }}
      </button>
      <button
        @click="$emit('submit')"
        class="rounded bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-500"
      >
        {{ $t("review_modal.submit") }}
      </button>
    </template>
  </Modal>
  <Drawer v-else :title="$t('review_modal.title')" :show="modal" @close="modal = false">
    <template v-slot:body>
      <EntertainmentDetailsReviewsModalContent :review="review" />
    </template>
    <template v-slot:footer>
      <button
        class="flex h-12 w-full select-none items-center justify-center rounded-full bg-yellow-500 px-4 py-2 font-semibold hover:opacity-75"
        @click="$emit('submit')"
      >
        {{ $t("review_modal.submit") }}
      </button>
    </template>
  </Drawer>
</template>
