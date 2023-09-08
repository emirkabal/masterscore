<script setup lang="ts">
import { ReviewData, TMDBData } from "~/@types"
import { useDark, onClickOutside } from "@vueuse/core"
import { Switch } from "@headlessui/vue"
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

watch(props.reviewData, () => {
  if (props.reviewData.rating < 0.5) {
    props.reviewData.rating = 0.5
  }
})

const onSelectEmoji = (emoji: any) => {
  props.reviewData.comment += emoji.i
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <p class="flex items-center gap-2 text-lg font-semibold">
        Your Rating:
        <input
          class="h-6 w-11 rounded p-0 text-center focus:outline-none focus:ring-0 dark:bg-zinc-700"
          type="number"
          :max="10"
          :min="0.5"
          :step="0.1"
          v-model="props.reviewData.rating"
        />
      </p>
      <StarRating
        :animate="true"
        :increment="0.5"
        :max-rating="10"
        :star-size="39"
        :show-rating="false"
        :star-points="[
          23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43, 38, 50, 36, 34, 46, 19,
          31, 17
        ]"
        :active-border-color="['#a30000', '#ffc400']"
        :active-color="['#f00', '#ff0']"
        :inactive-color="isDark ? '#000' : '#fff'"
        :border-width="2"
        :active-on-click="true"
        v-model:rating="props.reviewData.rating"
      ></StarRating>
    </div>
    <div>
      <div class="relative mb-2 flex items-center justify-between">
        <p class="select-none text-lg font-semibold">Comment</p>

        <Transition name="fade">
          <TwemojiParse png>
            <EmojiPicker
              v-show="isEmojiSelector"
              ref="emojiPicker"
              class="absolute right-0 z-20"
              :display-recent="true"
              :native="true"
              :theme="isDark ? 'dark' : 'light'"
              @select="onSelectEmoji"
            />
          </TwemojiParse>
        </Transition>
      </div>

      <div class="relative">
        <textarea
          type="text"
          :value="props.reviewData.comment"
          :maxlength="512"
          @input="(e:any) => (props.reviewData.comment = e.target.value)"
          placeholder="Write a review..."
          class="h-32 w-full select-none resize-none rounded border-gray-400 dark:border-zinc-800 dark:bg-zinc-800"
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
        <Switch
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
        </Switch>
        <label for="spoiler" class="cursor-pointer select-none opacity-80">
          My comment contains spoilers
        </label>
      </div>
    </div>
  </div>
</template>
