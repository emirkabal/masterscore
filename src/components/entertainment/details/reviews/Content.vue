<script setup lang="ts">
defineProps<{
  review: any
  skipInfo?: boolean
}>()
</script>

<template>
  <div class="group relative">
    <!-- <TwemojiParse v-if="review.content" v-show="review.content" png> -->
    <p
      class="break-words text-sm leading-5 tracking-[0.020em] md:text-base"
      :class="{
        'group relative opacity-50 blur-sm transition-all':
          review?.spoiler && !review.spoilerRevealed
      }"
    >
      {{ review?.content }}
    </p>
    <!-- </TwemojiParse> -->
    <span
      v-show="review?.spoiler && !review.spoilerRevealed"
      @click="review.spoilerRevealed = true"
      v-if="review?.content && review?.spoiler"
      class="absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded bg-brand/80 p-2 px-2 py-0.5 text-center font-maven text-sm font-bold transition-all duration-200 ease-in-out group-hover:bg-brand/60"
      >Spoiler</span
    >
    <p class="italic tracking-tight opacity-75" v-if="!review?.content && !skipInfo">
      {{ $t("no_comment_for_this_review") }}
    </p>
  </div>
</template>
