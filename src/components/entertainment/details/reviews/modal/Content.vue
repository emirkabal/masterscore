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
            :star-size="32"
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
          class="h-32 w-full select-none resize-none rounded border-gray-700 bg-gray-950/50 p-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
        <div class="absolute bottom-0 right-0 z-10 m-2 rounded text-sm text-gray-300">
          <button @click="isEmojiSelector = !isEmojiSelector" class="p-1 hover:bg-zinc-600">
            <Icon name="ic:outline-emoji-emotions" class="h-8 w-8" />
          </button>
        </div>
      </div>
      <div class="my-2 flex items-center space-x-2" v-if="review.content.trim().length > 0">
        <Checkbox
          id="spoiler"
          @update:checked="(e) => (review.spoiler = e)"
          :checked="review.spoiler"
          class="text-sm"
        />
        <label
          for="spoiler"
          class="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ $t("review_modal.contains_spoiler") }}
        </label>
      </div>
    </div>
  </div>
</template>
