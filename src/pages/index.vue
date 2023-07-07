<script setup>
useHead({
  title: "Masterscore",
  titleTemplate: "%s"
})

const { data, pending } = await useLazyFetch("/api/extra/home", {
  headers: generateHeaders()
})
</script>
<template>
  <div v-if="pending">
    <Spinner class="mx-auto h-screen" />
  </div>
  <div v-else-if="data">
    <HomeFeaturedEntertainment :data="data.featured" />
    <div class="container mx-auto my-12 space-y-12 px-2">
      <section class="space-y-2">
        <h1 class="text-2xl font-semibold">Trending Today</h1>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in data.trending"
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
            v-for="(item, i) in data.top_rated"
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
          data.recommendations &&
          data.recommendations.results &&
          data.recommendations.results.length > 0
        "
        class="space-y-2"
      >
        <div>
          <h1 class="text-2xl font-semibold">You Need to Watch</h1>
          <p>
            based on
            <NuxtLink
              :to="`/details/${data.recommendations.releated.type}/${data.recommendations.releated.id}`"
              class="font-medium hover:underline"
              >{{ data.recommendations.releated.info.title }}</NuxtLink
            >
          </p>
        </div>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in data.recommendations.results"
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
            v-for="(item, i) in data.popular"
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
      <section v-if="data.watchlist.length > 0" class="space-y-2">
        <h1 class="text-2xl font-semibold">Don't Forget to Watch</h1>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in data.watchlist"
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
            v-for="(item, i) in data.most_liked"
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
      <HomeShowMasterTable />
      <section class="space-y-2">
        <h1 class="text-2xl font-semibold">Now Playing</h1>
        <OverflowBehavior>
          <EntertainmentLargeCard
            v-for="(item, i) in data.now_playing"
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
            v-for="(item, i) in data.upcoming"
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
