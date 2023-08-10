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
  <div v-if="homePending">
    <Spinner class="mx-auto h-screen" />
  </div>
  <div v-else-if="home">
    <HomeFeaturedEntertainment :data="home.featured" />
    <div class="container mx-auto my-12 space-y-12 px-4">
      <section class="space-y-2">
        <h1 class="text-2xl font-semibold">Trending Today</h1>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in home.trending"
            :key="'trending-' + i"
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
      <section class="space-y-2">
        <div>
          <h1 class="text-2xl font-semibold">Top Rated Movies & TV Shows</h1>
          <p>based on <Logo /></p>
        </div>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in home.top_rated"
            :key="'top_rated-' + i"
            :data="{
              title: item.entertainment.info.title,
              release_date: item.entertainment.info.release_date,
              url: `${item.entertainment.type}/${item.entertainment.id}`,
              poster: item.entertainment.info.poster,
              backdrop: item.entertainment.info.backdrop
            }"
          />
        </OverflowBehavior>
      </section>
      <HomeShowFeed />
      <section
        v-if="
          home.recommendations &&
          home.recommendations.results &&
          home.recommendations.results.length > 0
        "
        class="space-y-2"
      >
        <div>
          <h1 class="text-2xl font-semibold">You Need to Watch</h1>
          <p>
            based on
            <NuxtLink
              :to="`/details/${home.recommendations.releated.type}/${home.recommendations.releated.id}`"
              class="font-medium hover:underline"
              >{{ home.recommendations.releated.info.title }}</NuxtLink
            >
          </p>
        </div>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in home.recommendations.results"
            :key="'recommendation-' + i"
            :data="{
              title: item.title,
              release_date: item.release_date,
              url: `${item.media_type}/${item.id}`,
              poster: item.poster_path,
              backdrop: item.backdrop_path
            }"
          />
        </OverflowBehavior>
      </section>

      <section class="space-y-2">
        <h1 class="text-2xl font-semibold">Popular Movies</h1>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in home.popular"
            :key="'popular-' + i"
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
      <section v-if="home.watchlist.length > 0" class="space-y-2">
        <h1 class="text-2xl font-semibold">Don't Forget to Watch</h1>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in home.watchlist"
            :key="'watchlist-' + i"
            :data="{
              title: item.info.title,
              release_date: item.info.release_date,
              url: `${item.type}/${item.id}`,
              poster: item.info.poster,
              backdrop: item.info.backdrop
            }"
          />
        </OverflowBehavior>
      </section>
      <section class="space-y-2">
        <div>
          <h1 class="text-2xl font-semibold">Most Recommended</h1>
          <p>based on <Logo /></p>
        </div>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in home.most_liked"
            :key="'most_liked-' + i"
            :data="{
              title: item.entertainment.info.title,
              release_date: item.entertainment.info.release_date,
              url: `${item.entertainment.type}/${item.entertainment.id}`,
              poster: item.entertainment.info.poster,
              backdrop: item.entertainment.info.backdrop
            }"
          />
        </OverflowBehavior>
      </section>
      <HomeShowMasterTable />
      <section class="space-y-2">
        <h1 class="text-2xl font-semibold">Now Playing</h1>
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
      <section class="space-y-2">
        <h1 class="text-2xl font-semibold">Upcoming Movies</h1>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in home.upcoming"
            :key="'popular-' + i"
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

      <HomeEasterEgg />
    </div>
  </div>
</template>
