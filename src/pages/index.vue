<script setup>
useHead({
  title: "Masterscore",
  titleTemplate: "%s"
})

const home = useState("home")
const homePending = useState("homePending")

if (!home.value) {
  const { data, pending } = await useLazyFetch("/api/extra/home", {
    headers: generateHeaders()
  })

  home.value = data.value
  homePending.value = pending.value

  watch(data, (data) => (home.value = data))
  watch(pending, (pending) => (homePending.value = pending))
}
</script>
<template>
  <section v-if="homePending && !home">
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center gap-8"
    >
      <span class="animate-ping text-9xl font-bold">Loading...</span>
    </div>
  </section>
  <section class="relative" v-else>
    <!-- <HomeFeaturedEntertainment :data="home.featured" /> -->
    <HomeMainSlider :data="home.trending" />
    <div class="mx-auto space-y-12">
      <section class="relative z-10 -mt-20 space-y-8">
        <h1 class="px-[4vw] font-maven text-2xl font-bold">Recommended</h1>
        <EntertainmentSlider
          :data="home.recommendations"
          :fixed-media-type="'movie'"
          :item-size="'large'"
          :offset="'auto'"
        />
      </section>
      <!-- <section class="relative z-10 space-y-8">
        <h1 class="px-[4vw] font-maven text-2xl font-bold">Recommended</h1>
        <EntertainmentSlider
          :data="home.recommendations"
          :fixed-media-type="'movie'"
          :item-size="'large'"
          :offset="'auto'"
        />
      </section> -->
    </div>
    <div class="my-20 space-y-12 px-[4vw]">
      <HomeShowFeed />
      <HomeShowMasterTable />
    </div>
  </section>
</template>
