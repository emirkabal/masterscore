<script setup lang="ts">
import { vIntersectionObserver } from "@vueuse/components"
import type { TMDBSearchResult } from "~/types"

const { $tgenre } = useNuxtApp()
const { t } = useI18n()
const route = useRoute()
const page = ref(1)
const results = ref<TMDBSearchResult[]>([])
const fetching = ref(0)

const fetch = async () => {
  fetching.value++
  const data = await $fetch(`/api/discover/${route.params.type}`, {
    headers: generateHeaders(),
    params: {
      with_genres: route.params.id,
      page: page.value
    }
  })
  if (data) {
    results.value.push(...data.results)
  }
  fetching.value--
}
fetch()

const onIntersectionObserver: any = async ([
  e
]: IntersectionObserverEntry[]) => {
  if (e.isIntersecting && fetching.value < 2 && results.value.length < 100) {
    page.value += 1
    fetch()
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
})

useHead({
  title: t(`genres.${$tgenre(route.params.id.toString())}`),
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <section class="my-24">
    <h1
      class="text-center text-2xl font-bold md:px-[4vw] md:text-start md:text-5xl"
    >
      {{ $t(`genres.${$tgenre($route.params.id.toString())}`) }}
    </h1>
    <NuxtLink
      to="/discover"
      class="mt-2 block text-center text-lg text-gray-300 transition-colors hover:text-white md:inline-block md:px-[4vw] md:text-start md:text-2xl"
    >
      {{ $t("discover.explore_more") }}
      <Icon name="ic:round-arrow-right-alt" class="inline h-6 w-6" />
    </NuxtLink>
    <div
      class="mt-8 flex flex-wrap items-center justify-center gap-4 md:items-start md:justify-start md:pl-[4vw]"
    >
      <EntertainmentSliderCard
        v-if="results.length > 0"
        v-for="item in results"
        class="!h-auto !w-auto !flex-shrink"
        :id="item.id"
        :media_type="$route.params.type === 'movie' ? 'movie' : 'tv'"
        :image="$timage(item.poster_path || '', 'w300')"
      />

      <EntertainmentSliderCard
        v-if="results.length < 100 || fetching > 0"
        v-for="i in 20"
        class="!h-auto !w-auto !flex-shrink"
        :loading="true"
        v-intersection-observer="onIntersectionObserver"
      />
    </div>
    <div class="mt-8 flex w-full">
      <button
        v-if="results.length > 100 && fetching === 0 && results.length < 500"
        @click="
          () => {
            page += 1
            fetch()
          }
        "
        class="mx-auto rounded bg-white px-4 py-2 font-semibold text-black transition-colors hover:bg-white/90"
      >
        {{ $t("discover.load_more") }}
      </button>
    </div>
  </section>
</template>
