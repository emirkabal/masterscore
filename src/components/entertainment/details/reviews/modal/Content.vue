<script setup lang="ts">
import { onClickOutside } from "@vueuse/core"

const props = defineProps<{
  review: any
}>()

const emojiPicker = ref(null)

const isEmojiSelector = ref(false)
onClickOutside(emojiPicker, () => {
  isEmojiSelector.value = false
})

const onSelectEmoji = (emoji: any) => {
  props.review.content += emoji.i
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <p class="mb-2 flex items-center text-lg font-semibold tracking-tight">
        {{ $t("review_modal.rating") }}
      </p>
      <div class="flex flex-wrap items-center gap-x-2 md:gap-x-6">
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
            :star-size="34"
            inactiveColor="#1f2937"
            starColor="#facc15"
            v-model="review.rating"
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
            theme="dark"
            @select="onSelectEmoji"
          />
        </Transition>
      </div>

      <div class="relative">
        <textarea
          type="text"
          :value="review.content"
          :maxlength="512"
          @input="(e: any) => (review.content = e.target.value)"
          :placeholder="$t('review_modal.placeholder')"
          class="h-32 w-full select-none resize-none rounded border-gray-700 bg-gray-800 p-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
        <div class="absolute bottom-0 right-0 z-10 m-2 rounded text-sm text-gray-300">
          <button @click="isEmojiSelector = !isEmojiSelector" class="p-1 hover:bg-zinc-600">
            <Icon name="ic:outline-emoji-emotions" class="h-8 w-8" />
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2" v-if="review.content.trim().length > 0">
        <HeadlessSwitch
          id="spoiler"
          v-model="review.spoiler"
          :class="review.spoiler ? 'bg-blue-700' : 'bg-teal-700'"
          class="relative inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <span class="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            :class="review.spoiler ? 'translate-x-3.5' : 'translate-x-0'"
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
