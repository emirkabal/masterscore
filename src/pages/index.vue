<script setup>
import { useLocalStorage } from "@vueuse/core"

useHead({
  title: "Masterscore",
  titleTemplate: "%s"
})

const notify = useLocalStorage("notify-2", true)

// $fetch("/api/extra/home", {
//   headers: generateHeaders()
// })
</script>
<template>
  <!-- <div>
    <HomeFeaturedEntertainment />
    <div class="mt-6 space-y-14 px-4 md:px-16 lg:px-24">
      <div>
        <h1 class="text-3xl font-semibold">Haftanın popülerleri</h1>
        <OverflowBehavior>
          <HomePopularEntertainments />
        </OverflowBehavior>
      </div>
    </div>
  </div> -->
  <section class="container mx-auto my-24 px-4">
    <Transition name="fade">
      <div
        v-show="notify"
        class="my-4 flex items-center justify-between rounded bg-blue-600/20 p-2 text-blue-600"
      >
        <span class="flex items-center gap-2.5">
          <IconsDownload class="h-6 w-6" />
          <span>
            <NuxtLink to="/users/@me/settings" class="hover:underline"
              >New Update! You can now add avatars to your profile!</NuxtLink
            >
          </span>
        </span>
        <button
          @click="notify = false"
          class="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-blue-600/50"
        >
          <IconsTimes class="h-4 w-4" />
        </button>
      </div>
    </Transition>
    <HomeRecommendations />
    <HomeMostRatedEntertainments />
    <HomeTrending />
    <div class="my-16 flex w-full flex-col-reverse gap-6 md:flex-row">
      <div class="w-full flex-grow space-y-8">
        <HomeShowMasterTable />
        <HomeShowFeed />
      </div>
      <div class="flex flex-col gap-6">
        <HomeMostLikedEntertainment />
        <HomeRandomMovie />
        <HomeEasterEgg />
      </div>
    </div>
  </section>
</template>
