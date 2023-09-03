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
      <Spinner class="scale-150" />
      <span class="text-4xl font-bold"> Loading </span>
    </div>
  </section>
  <section class="relative" v-else>
    <!-- <HomeFeaturedEntertainment :data="home.featured" /> -->
    <HomeMainSlider :data="home.trending" />
    <div class="mx-auto space-y-12 px-[4vw]">
      <section class="relative z-10 -mt-20 space-y-4">
        <h1 class="font-maven text-2xl font-bold">Now Playing</h1>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in home.now_playing"
            :key="'now_playing-' + i"
            :data="{
              title: item.title,
              release_date: item.release_date,
              url: `movie/${item.id}`,
              poster: item.poster_path,
              backdrop: item.backdrop_path
            }"
          />
        </OverflowBehavior>
      </section>
    </div>
    <div class="my-20 space-y-12 px-[4vw]">
      <HomeShowFeed />
      <HomeShowMasterTable />
    </div>
  </section>
</template>
