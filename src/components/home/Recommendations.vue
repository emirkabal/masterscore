<script setup lang="ts">
import { IEntertainment, TMDBSearchResult } from "~/@types"
import { useUserStore } from "~/store/user"
const { isLoggedIn } = useUserStore()

const items = ref<TMDBSearchResult[]>([])
const notFeaturedItem = ref<TMDBSearchResult>()
const { data, pending } = await useLazyFetch<{
  releated: IEntertainment
  results: TMDBSearchResult[]
}>("/api/recommendations", {
  headers: generateHeaders()
})

watch(data, () => {
  if (data.value && data.value.results) {
    items.value = data.value.results.slice(0, 8)
    notFeaturedItem.value = data.value.results[9]
  }
})
</script>
<template>
  <div>
    <div class="my-4">
      <h1
        class="border-l-4 border-green-500 pl-2 text-2xl font-bold tracking-wide"
      >
        Recommendations For You
      </h1>
      <p v-if="data && data.releated" class="mt-2 opacity-75">
        Based on your recommendations of
        <NuxtLink
          :to="`/details/${data.releated.type}/${data.releated.id}`"
          class="font-semibold hover:underline"
          >{{ data.releated.info.title }}</NuxtLink
        >
      </p>
    </div>
    <NuxtLink
      to="/account/login"
      v-if="!isLoggedIn"
      class="inline-block w-full rounded-3xl bg-gray-200 py-20 text-center transition-colors hover:bg-gray-300 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      <Logo class="mx-auto h-12 w-12" /> <br />
      <span class="font-semibold">Sign in</span> to get recommendations based on
      your watch history.
    </NuxtLink>
    <div
      v-else-if="!pending && items.length === 0"
      class="inline-block w-full rounded-3xl bg-gray-200 py-20 text-center transition-colors hover:bg-gray-300 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      <Logo class="mx-auto h-12 w-12" /> <br />
      <span class="font-semibold">No recommendations</span> found for you.
      Recommendations are based on your like history.
    </div>
    <div
      v-else-if="pending"
      class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <HomeTrendingCard v-for="i in 8" :key="i" :loading="true" />
      <HomeTrendingCard class="hidden lg:flex xl:hidden" :loading="true" />
    </div>
    <div
      v-else-if="items.length > 0 && !pending"
      class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <HomeTrendingCard
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :type="item.media_type"
        :title="item.title || item.name"
        :overview="item.overview"
        :poster="item.poster_path"
        :backdrop="item.backdrop_path"
      />
      <HomeTrendingCard
        class="hidden lg:flex xl:hidden"
        v-if="notFeaturedItem"
        :id="notFeaturedItem.id"
        :type="notFeaturedItem.media_type"
        :title="notFeaturedItem.title || notFeaturedItem.name"
        :overview="notFeaturedItem.overview"
        :poster="notFeaturedItem.poster_path"
        :backdrop="notFeaturedItem.backdrop_path"
      />
    </div>
  </div>
</template>
