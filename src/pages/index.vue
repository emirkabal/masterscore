<script setup>
import { useLocalStorage } from "@vueuse/core"

useHead({
  title: "Masterscore",
  titleTemplate: "%s"
})

const notify = useLocalStorage("notify-1", true)
</script>
<template>
  <div class="container mx-auto my-24 px-4">
    <Transition name="fade">
      <div
        v-show="notify"
        class="my-4 flex items-center justify-between rounded bg-blue-600/20 p-2 text-blue-600"
      >
        <span class="flex items-center gap-2.5">
          <IconsDownload class="h-6 w-6" />
          <span>
            <a
              href="https://dervis.emirkabal.com/XnPJY7voCseJUalI.png"
              target="_blank"
              class="hover:underline"
              >Click here to check out the new update!</a
            ></span
          >
        </span>
        <button
          @click="notify = false"
          class="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-blue-600/50"
        >
          <IconsTimes class="h-4 w-4" />
        </button>
      </div>
    </Transition>
    <HomeTrending />
    <HomeMostReviewedEntertainments />
    <!-- <HomeMostLikedEntertainments /> -->
    <div class="my-16 flex w-full flex-col-reverse gap-12 md:flex-row">
      <HomeLatestReviews class="w-full flex-grow" />
      <div class="flex flex-col gap-6">
        <HomeMostLikedEntertainment />
        <HomeViewScores />
        <HomeRandomMovie />
      </div>
    </div>
  </div>
</template>
