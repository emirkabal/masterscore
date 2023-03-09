<script setup>
const { data, pending } = useLazyFetch("/api/extra/trending/all")
const items = ref([])
const notFeaturedItem = ref(null)

watch(data, () => {
  items.value = data.value.slice(0, 8)
  notFeaturedItem.value = data.value[9]
})
</script>

<template>
  <div>
    <h1
      class="mb-4 border-l-4 border-blue-600 pl-2 text-2xl font-bold tracking-wide"
    >
      Trending This Week
    </h1>
    <div v-if="pending" class="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
      <HomeTrendingCard v-for="i in 8" :key="i" :loading="true" />
      <HomeTrendingCard class="hidden md:flex xl:hidden" :loading="true" />
    </div>
    <div v-else class="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
      <HomeTrendingCard
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :type="item.media_type"
        :title="item.title || item.name"
        :overview="item.overview"
        :poster="item.poster_path"
        :backdrop="item.backdrop_path"
        :rating="item.vote_average"
      />
      <HomeTrendingCard
        class="hidden md:flex xl:hidden"
        :id="notFeaturedItem.id"
        :type="notFeaturedItem.media_type"
        :title="notFeaturedItem.title || notFeaturedItem.name"
        :overview="notFeaturedItem.overview"
        :poster="notFeaturedItem.poster_path"
        :backdrop="notFeaturedItem.backdrop_path"
        :rating="notFeaturedItem.vote_average"
      />
    </div>
  </div>
</template>
