<script setup lang="ts">
import type { ReviewData, TMDBData } from "~/types"
import { useDark, onClickOutside } from "@vueuse/core"

const isDark = useDark()

const props = defineProps<{
  data: TMDBData
  reviewData: ReviewData
}>()

const emojiPicker = ref(null)

const isEmojiSelector = ref(false)
onClickOutside(emojiPicker, () => {
  isEmojiSelector.value = false
})

const onSelectEmoji = (emoji: any) => {
  props.reviewData.comment += emoji.i
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <p class="mb-2 flex items-center text-lg font-semibold tracking-tight">
        {{ $t("review_modal.rating") }}
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <FormStarInput
          :rating="props.reviewData.rating"
          @update:rating="(val: number) => (props.reviewData.rating = val)"
        />
        <div
          @click="
            () => {
              if (props.reviewData.rating >= 9.6) props.reviewData.rating = 10
            }
          "
        >
          <StarRating
            :animate="true"
            :numberOfStars="10"
            :star-size="36"
            v-model="props.reviewData.rating"
          ></StarRating>
        </div>
      </div>
    </div>
    <div>
      <div class="relative mb-2 flex items-center justify-between">
        <p class="select-none text-lg font-semibold tracking-tight">
          {{ $t("review_modal.comment") }}
        </p>

        <Transition name="fade">
          <EmojiPicker
            v-show="isEmojiSelector"
            ref="emojiPicker"
            class="absolute right-0 z-20"
            :display-recent="true"
            :native="true"
            :theme="isDark ? 'dark' : 'light'"
            @select="onSelectEmoji"
          />
        </Transition>
      </div>

      <div class="relative">
        <textarea
          type="text"
          :value="props.reviewData.comment"
          :maxlength="512"
          @input="(e: any) => (props.reviewData.comment = e.target.value)"
          :placeholder="$t('review_modal.placeholder')"
          class="h-32 w-full select-none resize-none border-gray-400 focus:ring-1 focus:ring-gray-700 dark:border-gray-800 dark:bg-gray-900"
        />
        <div
          class="absolute bottom-0 right-0 z-10 m-2 rounded text-sm text-gray-500 dark:text-gray-300"
        >
          <button
            @click="isEmojiSelector = !isEmojiSelector"
            class="p-1 hover:bg-gray-50 dark:hover:bg-zinc-600"
          >
            <Icon name="ic:outline-emoji-emotions" class="h-8 w-8" />
          </button>
        </div>
      </div>
      <div
        class="flex items-center gap-2"
        v-if="props.reviewData.comment.trim().length > 0"
      >
        <HeadlessSwitch
          id="spoiler"
          v-model="props.reviewData.spoiler"
          :class="props.reviewData.spoiler ? 'bg-blue-700' : 'bg-teal-700'"
          class="relative inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <span class="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            :class="
              props.reviewData.spoiler ? 'translate-x-3.5' : 'translate-x-0'
            "
            class="pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
          />
        </HeadlessSwitch>
        <label for="spoiler" class="cursor-pointer select-none opacity-80">
          My comment contains spoilers
        </label>
      </div>
    </div>
  </div>
</template>
